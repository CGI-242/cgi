// server/src/services/chat.service.ts
// Service chat IA fiscal - RAG hybride + Claude API + gestion conversations Prisma

import Anthropic from "@anthropic-ai/sdk";
import { buildSimplePrompt, buildFiscalPrompt, buildContextPrompt, buildSocialContextPrompt, buildSocialFallbackPrompt } from "./chat.prompts";
import { hybridSearch, isSocialQuery, SearchResult } from "./rag/hybrid-search.service";
import { isFiscalQuery, buildContext, extractArticlesFromResponse, Citation } from "./rag/chat.utils";
import { createLogger } from "../utils/logger";
import prisma from "../utils/prisma";
import { trackUsage } from "./usage-stats.service";
import { incrementQuota } from "./subscription.service";
import { orchestrate } from "./orchestrator";

const logger = createLogger('ChatService');
const anthropic = new Anthropic(); // utilise ANTHROPIC_API_KEY env var

const CLAUDE_MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 2000;
const MAX_HISTORY_MESSAGES = 10;
const MAX_HISTORY_CHARS = 12000; // ~3000 tokens — budget historique conversation

const GREETING_PATTERNS = [
  /^(bonjour|bonsoir|salut|hello|hi|hey|coucou|yo)\b/i,
  /^(merci|thanks|thank you)\b/i,
  /^(au revoir|bye|a bientot|a\+)\b/i,
  /^(comment vas-tu|ca va|comment tu vas)\b/i,
  /^(qui es-tu|tu es qui|c est quoi cgi)\b/i,
];

/**
 * Tronque l'historique pour respecter le budget de tokens.
 * Garde les messages les plus récents en priorité.
 */
function trimHistory(messages: { role: string; content: string }[]): { role: string; content: string }[] {
  const trimmed: { role: string; content: string }[] = [];
  let totalChars = 0;

  // Parcours du plus récent au plus ancien
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    const msgChars = msg.content.length;

    if (totalChars + msgChars > MAX_HISTORY_CHARS) break;

    trimmed.unshift(msg);
    totalChars += msgChars;
  }

  return trimmed;
}

/**
 * Detecte si le message est une salutation simple
 */
export function isSimpleGreeting(query: string): boolean {
  const trimmed = query.trim();
  return GREETING_PATTERNS.some((pattern) => pattern.test(trimmed));
}

/**
 * Effectue la recherche RAG si c'est une question fiscale
 * Retourne les résultats de recherche ou null en cas d'erreur/salutation
 */
async function performRAGSearch(content: string): Promise<SearchResult[] | null> {
  if (!isFiscalQuery(content)) {
    return null;
  }

  try {
    const results = await hybridSearch(content, 8, '2026');
    if (results.length > 0) {
      logger.info(`RAG: ${results.length} articles trouvés pour "${content.substring(0, 50)}..."`);
      return results;
    }
    return null;
  } catch (error) {
    logger.warn('RAG indisponible, fallback sur connaissances statiques:', error);
    return null;
  }
}

/**
 * Envoyer un message et recevoir la reponse complete (non-streaming)
 */
export async function sendMessage(
  userId: string,
  content: string,
  conversationId?: string,
  organizationId?: string
) {
  // 1. Creer ou recuperer la conversation
  let conversation;
  if (conversationId) {
    conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, creatorId: userId, ...(organizationId ? { organizationId } : {}) },
    });
    if (!conversation) {
      throw new Error("Conversation introuvable");
    }
  } else {
    conversation = await prisma.conversation.create({
      data: {
        creatorId: userId,
        title: content.slice(0, 80),
        ...(organizationId ? { organizationId } : {}),
      },
    });
  }

  // 2. Sauver le message USER
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      authorId: userId,
      role: "USER",
      content,
    },
  });

  // 3. Recuperer les derniers messages et tronquer selon le budget
  const rawMessages = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "asc" },
    take: MAX_HISTORY_MESSAGES,
    select: { role: true, content: true },
  });
  const previousMessages = trimHistory(rawMessages);

  // 4. RAG: recherche hybride si question fiscale
  const searchResults = await performRAGSearch(content);

  // 5. Choisir le prompt systeme + orchestration multi-agent
  const socialQuery = isSocialQuery(content);
  let systemPrompt: string;
  if (isSimpleGreeting(content)) {
    systemPrompt = buildSimplePrompt();
  } else if (searchResults && searchResults.length > 0) {
    const context = buildContext(searchResults);
    // Utiliser le bon prompt selon le type de question
    const basePrompt = socialQuery ? buildSocialContextPrompt(context) : buildContextPrompt(context);
    const { enhancedSystemPrompt, agent } = orchestrate(content, basePrompt);
    systemPrompt = enhancedSystemPrompt;
    logger.info(`Agent sélectionné: ${agent.name} (social: ${socialQuery})`);
  } else {
    // Fallback sans RAG
    const basePrompt = socialQuery ? buildSocialFallbackPrompt() : buildFiscalPrompt();
    const { enhancedSystemPrompt } = orchestrate(content, basePrompt);
    systemPrompt = enhancedSystemPrompt;
  }

  // 6. Appeler Claude
  const startTime = Date.now();
  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt,
    messages: previousMessages.map((msg) => ({
      role: msg.role === "USER" ? "user" as const : "assistant" as const,
      content: msg.content,
    })),
  });

  const responseTime = Date.now() - startTime;
  const assistantContent =
    response.content[0].type === "text" ? response.content[0].text : "";
  const tokensUsed =
    (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);

  // 7. Extraire les citations
  let citations: Citation[] | undefined;
  if (searchResults && searchResults.length > 0) {
    citations = extractArticlesFromResponse(assistantContent, searchResults);
  }

  // 8. Sauver le message ASSISTANT avec citations
  const assistantMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "ASSISTANT",
      content: assistantContent,
      citations: citations && citations.length > 0 ? JSON.parse(JSON.stringify(citations)) : undefined,
      tokensUsed,
      responseTime,
    },
  });

  // 9. Fire-and-forget : enregistrer SearchHistory + UsageStats
  recordSearchAndUsage(userId, content, searchResults, tokensUsed);

  return {
    conversationId: conversation.id,
    message: assistantMessage,
  };
}

/**
 * Envoyer un message avec streaming SSE
 * Utilise un generateur async pour yield les events
 */
export async function* sendMessageStream(
  userId: string,
  content: string,
  conversationId?: string,
  organizationId?: string
): AsyncGenerator<{ event: string; data: string }> {
  // 1. Creer ou recuperer la conversation
  let conversation;
  if (conversationId) {
    conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, creatorId: userId, ...(organizationId ? { organizationId } : {}) },
    });
    if (!conversation) {
      throw new Error("Conversation introuvable");
    }
  } else {
    conversation = await prisma.conversation.create({
      data: {
        creatorId: userId,
        title: content.slice(0, 80),
        ...(organizationId ? { organizationId } : {}),
      },
    });
  }

  // Emettre l'ID de la conversation
  yield {
    event: "conversation",
    data: JSON.stringify({ conversationId: conversation.id }),
  };

  // 2. Sauver le message USER
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      authorId: userId,
      role: "USER",
      content,
    },
  });

  // 3. Recuperer les derniers messages et tronquer selon le budget
  const rawMessages = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "asc" },
    take: MAX_HISTORY_MESSAGES,
    select: { role: true, content: true },
  });
  const previousMessages = trimHistory(rawMessages);

  // 4. RAG: recherche hybride si question fiscale
  const searchResults = await performRAGSearch(content);

  // 5. Choisir le prompt systeme + orchestration multi-agent
  const socialQueryStream = isSocialQuery(content);
  let systemPrompt: string;
  if (isSimpleGreeting(content)) {
    systemPrompt = buildSimplePrompt();
  } else if (searchResults && searchResults.length > 0) {
    const context = buildContext(searchResults);
    const basePrompt = socialQueryStream ? buildSocialContextPrompt(context) : buildContextPrompt(context);
    const { enhancedSystemPrompt, agent } = orchestrate(content, basePrompt);
    systemPrompt = enhancedSystemPrompt;
    logger.info(`Agent sélectionné (stream): ${agent.name} (social: ${socialQueryStream})`);
  } else {
    const basePrompt = socialQueryStream ? buildSocialFallbackPrompt() : buildFiscalPrompt();
    const { enhancedSystemPrompt } = orchestrate(content, basePrompt);
    systemPrompt = enhancedSystemPrompt;
  }

  // 6. Appeler Claude en streaming
  const startTime = Date.now();
  let fullContent = "";

  const stream = anthropic.messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt,
    messages: previousMessages.map((msg) => ({
      role: msg.role === "USER" ? "user" as const : "assistant" as const,
      content: msg.content,
    })),
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      fullContent += event.delta.text;
      yield {
        event: "chunk",
        data: JSON.stringify({ text: event.delta.text }),
      };
    }
  }

  const finalMessage = await stream.finalMessage();
  const responseTime = Date.now() - startTime;
  const tokensUsed =
    (finalMessage.usage?.input_tokens || 0) +
    (finalMessage.usage?.output_tokens || 0);

  // 7. Extraire les citations
  let citations: Citation[] | undefined;
  if (searchResults && searchResults.length > 0) {
    citations = extractArticlesFromResponse(fullContent, searchResults);

    // Emettre les citations
    if (citations.length > 0) {
      yield {
        event: "citations",
        data: JSON.stringify({ citations }),
      };
    }
  }

  // 8. Sauver le message ASSISTANT complet avec citations
  const assistantMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "ASSISTANT",
      content: fullContent,
      citations: citations && citations.length > 0 ? JSON.parse(JSON.stringify(citations)) : undefined,
      tokensUsed,
      responseTime,
    },
  });

  // 9. Fire-and-forget : enregistrer SearchHistory + UsageStats
  // skipQuotaIncrement=true car le middleware checkQuestionQuota a déjà incrémenté (M13)
  recordSearchAndUsage(userId, content, searchResults, tokensUsed, true);

  // 11. Event done
  yield {
    event: "done",
    data: JSON.stringify({
      messageId: assistantMessage.id,
      tokensUsed,
      responseTime,
    }),
  };
}

/**
 * Lister les conversations d'un utilisateur
 */
export async function getConversations(userId: string, organizationId?: string) {
  return prisma.conversation.findMany({
    where: { creatorId: userId, ...(organizationId ? { organizationId } : {}) },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { messages: true } },
    },
  });
}

/**
 * Recuperer une conversation avec ses messages
 */
export async function getConversation(userId: string, conversationId: string, organizationId?: string) {
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, creatorId: userId, ...(organizationId ? { organizationId } : {}) },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          role: true,
          content: true,
          citations: true,
          tokensUsed: true,
          responseTime: true,
          createdAt: true,
        },
      },
    },
  });

  if (!conversation) {
    throw new Error("Conversation introuvable");
  }

  return conversation;
}

/**
 * Supprimer une conversation
 */
export async function deleteConversation(
  userId: string,
  conversationId: string
) {
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, creatorId: userId },
  });

  if (!conversation) {
    throw new Error("Conversation introuvable");
  }

  await prisma.conversation.delete({
    where: { id: conversationId },
  });

  return { success: true };
}

/**
 * Enregistre SearchHistory, met à jour UsageStats et incrémente le quota (fire-and-forget).
 * Résout l'articleId via le numéro d'article du premier résultat RAG.
 */
function recordSearchAndUsage(
  userId: string,
  query: string,
  searchResults: SearchResult[] | null,
  tokensUsed: number,
  skipQuotaIncrement = false
): void {
  const firstNumero = searchResults?.[0]?.payload?.numero;

  // SearchHistory
  const insertSearch = firstNumero
    ? prisma.article
        .findFirst({ where: { numero: firstNumero }, select: { id: true } })
        .then(article =>
          prisma.searchHistory.create({
            data: { userId, query, articleId: article?.id || null },
          })
        )
    : prisma.searchHistory.create({
        data: { userId, query, articleId: null },
      });

  insertSearch.catch(err => logger.warn('SearchHistory insert failed:', err));

  // UsageStats
  trackUsage({
    userId,
    questionsAsked: 1,
    articlesViewed: searchResults?.length || 0,
    tokensUsed,
  }).catch(err => logger.warn('UsageStats update failed:', err));

  // Quota abonnement : incrémenter questionsUsed du user
  // Sauf si le middleware checkQuestionQuota a déjà fait l'incrément atomique (M13)
  if (!skipQuotaIncrement) {
    prisma.organizationMember.findFirst({
      where: { userId },
      select: { organizationId: true },
    }).then(member => {
      if (member) {
        return incrementQuota(member.organizationId, userId);
      }
    }).catch(err => logger.warn('IncrementQuota failed:', err));
  }
}
