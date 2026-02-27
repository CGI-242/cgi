// server/src/services/orchestrator/index.ts
// Orchestrateur multi-agent : route les questions vers l'agent fiscal spécialisé

import { routeToAgent, type FiscalAgent } from './agents';
import { createLogger } from '../../utils/logger';

const logger = createLogger('Orchestrator');

export interface OrchestratorResult {
  agent: FiscalAgent;
  enhancedSystemPrompt: string;
  ragKeywords?: string[];
}

/**
 * Analyse une question et détermine l'agent spécialisé à utiliser.
 * Retourne l'agent + un prompt système enrichi avec ses instructions spécialisées.
 */
export function orchestrate(query: string, baseSystemPrompt: string): OrchestratorResult {
  const agent = routeToAgent(query);

  logger.info(`Question routée vers ${agent.name} (${agent.id})`);

  // Si agent général, pas d'enrichissement
  if (agent.id === 'agent-general') {
    return {
      agent,
      enhancedSystemPrompt: baseSystemPrompt,
    };
  }

  // Enrichir le prompt avec les instructions spécialisées de l'agent
  const enhancedSystemPrompt = `${baseSystemPrompt}

=== AGENT SPÉCIALISÉ : ${agent.name.toUpperCase()} ===
${agent.systemInstruction}

INSTRUCTION : Tu réponds en priorité avec ton expertise ${agent.name}. Si la question sort de ton domaine, réponds quand même mais précise les articles pertinents.`;

  // Extraire les mots-clés RAG prioritaires de l'agent
  const ragKeywords = [
    ...(agent.ragPriority.keywords || []),
    ...agent.keywords.slice(0, 3),
  ];

  return {
    agent,
    enhancedSystemPrompt,
    ragKeywords,
  };
}

export { routeToAgent, type FiscalAgent } from './agents';
