// server/src/services/chat.service.ts
// Service chat IA fiscal - RAG hybride + Claude API + gestion conversations Prisma

import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";
import { buildSimplePrompt, buildFiscalPrompt, buildContextPrompt } from "./chat.prompts";
import { hybridSearch, SearchResult } from "./rag/hybrid-search.service";
import { isFiscalQuery, buildContext, extractArticlesFromResponse, Citation } from "./rag/chat.utils";
import { createLogger } from "../utils/logger";

const logger = createLogger('ChatService');
const prisma = new PrismaClient();
const anthropic = new Anthropic(); // utilise ANTHROPIC_API_KEY env var

const CLAUDE_MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 2000;

const GREETING_PATTERNS = [
  /^(bonjour|bonsoir|salut|hello|hi|hey|coucou|yo)\b/i,
  /^(merci|thanks|thank you)\b/i,
  /^(au revoir|bye|a bientot|a\+)\b/i,
  /^(comment vas-tu|ca va|comment tu vas)\b/i,
  /^(qui es-tu|tu es qui|c est quoi cgi)\b/i,
];

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
  conversationId?: string
) {
  // 1. Creer ou recuperer la conversation
  let conversation;
  if (conversationId) {
    conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, creatorId: userId },
    });
    if (!conversation) {
      throw new Error("Conversation introuvable");
    }
  } else {
    conversation = await prisma.conversation.create({
      data: {
        creatorId: userId,
        title: content.slice(0, 80),
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

  // 3. Recuperer les 10 derniers messages pour le contexte
  const previousMessages = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "asc" },
    take: 10,
    select: { role: true, content: true },
  });

  // 4. RAG: recherche hybride si question fiscale
  const searchResults = await performRAGSearch(content);

  // 5. Choisir le prompt systeme
  let systemPrompt: string;
  if (isSimpleGreeting(content)) {
    systemPrompt = buildSimplePrompt();
  } else if (searchResults && searchResults.length > 0) {
    const context = buildContext(searchResults);
    systemPrompt = buildContextPrompt(context);
  } else {
    systemPrompt = buildFiscalPrompt();
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
  conversationId?: string
): AsyncGenerator<{ event: string; data: string }> {
  // 1. Creer ou recuperer la conversation
  let conversation;
  if (conversationId) {
    conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, creatorId: userId },
    });
    if (!conversation) {
      throw new Error("Conversation introuvable");
    }
  } else {
    conversation = await prisma.conversation.create({
      data: {
        creatorId: userId,
        title: content.slice(0, 80),
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

  // 3. Recuperer les 10 derniers messages pour le contexte
  const previousMessages = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "asc" },
    take: 10,
    select: { role: true, content: true },
  });

  // 4. RAG: recherche hybride si question fiscale
  const searchResults = await performRAGSearch(content);

  // 5. Choisir le prompt systeme
  let systemPrompt: string;
  if (isSimpleGreeting(content)) {
    systemPrompt = buildSimplePrompt();
  } else if (searchResults && searchResults.length > 0) {
    const context = buildContext(searchResults);
    systemPrompt = buildContextPrompt(context);
  } else {
    systemPrompt = buildFiscalPrompt();
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

  // 9. Event done
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
export async function getConversations(userId: string) {
  return prisma.conversation.findMany({
    where: { creatorId: userId },
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
export async function getConversation(userId: string, conversationId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, creatorId: userId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          role: true,
          content: true,
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
