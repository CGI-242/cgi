// server/src/services/orchestrator/index.ts
// Orchestrateur multi-agent : route les questions vers l'agent fiscal OU social spécialisé

import { routeToAgent, type FiscalAgent } from './agents';
import { routeToSocialAgent, type SocialAgent } from './social-agents';
import { isSocialQuery } from '../rag/hybrid-search.service';
import { createLogger } from '../../utils/logger';

const logger = createLogger('Orchestrator');

export interface OrchestratorResult {
  agent: FiscalAgent | SocialAgent;
  enhancedSystemPrompt: string;
  ragKeywords?: string[];
  isSocial?: boolean;
}

/**
 * Analyse une question et détermine l'agent spécialisé à utiliser.
 * Route automatiquement vers un agent fiscal OU social selon le contenu.
 */
export function orchestrate(query: string, baseSystemPrompt: string): OrchestratorResult {
  const social = isSocialQuery(query);

  if (social) {
    // Routing vers agent social
    const agent = routeToSocialAgent(query);
    logger.info(`Question SOCIALE routée vers ${agent.name} (${agent.id})`);

    if (agent.id === 'social-agent-general') {
      return { agent, enhancedSystemPrompt: baseSystemPrompt, isSocial: true };
    }

    const enhancedSystemPrompt = `${baseSystemPrompt}

=== AGENT SPÉCIALISÉ : ${agent.name.toUpperCase()} ===
${agent.systemInstruction}

INSTRUCTION : Tu réponds en priorité avec ton expertise ${agent.name}. Si la question sort de ton domaine social, réponds quand même mais précise les articles pertinents du Code du travail ou du Code de la sécurité sociale.`;

    const ragKeywords = [
      ...(agent.ragPriority.keywords || []),
      ...agent.keywords.slice(0, 3),
    ];

    return { agent, enhancedSystemPrompt, ragKeywords, isSocial: true };
  }

  // Routing vers agent fiscal (existant)
  const agent = routeToAgent(query);
  logger.info(`Question FISCALE routée vers ${agent.name} (${agent.id})`);

  if (agent.id === 'agent-general') {
    return { agent, enhancedSystemPrompt: baseSystemPrompt, isSocial: false };
  }

  const enhancedSystemPrompt = `${baseSystemPrompt}

=== AGENT SPÉCIALISÉ : ${agent.name.toUpperCase()} ===
${agent.systemInstruction}

INSTRUCTION : Tu réponds en priorité avec ton expertise ${agent.name}. Si la question sort de ton domaine, réponds quand même mais précise les articles pertinents.`;

  const ragKeywords = [
    ...(agent.ragPriority.keywords || []),
    ...agent.keywords.slice(0, 3),
  ];

  return { agent, enhancedSystemPrompt, ragKeywords, isSocial: false };
}

export { routeToAgent, type FiscalAgent } from './agents';
export { routeToSocialAgent, type SocialAgent } from './social-agents';
