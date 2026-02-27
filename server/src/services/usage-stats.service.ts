// server/src/services/usage-stats.service.ts
// Service de suivi des statistiques d'usage (UsageStats)

import prisma from "../utils/prisma";
import { createLogger } from "../utils/logger";

const logger = createLogger('UsageStatsService');

/**
 * Incrémente les compteurs UsageStats pour un utilisateur à la date du jour.
 * Utilise upsert pour créer ou mettre à jour l'entrée.
 * Appel fire-and-forget recommandé (ne pas await dans le chemin critique).
 */
export async function trackUsage(params: {
  userId: string;
  organizationId?: string;
  questionsAsked?: number;
  articlesViewed?: number;
  tokensUsed?: number;
}): Promise<void> {
  const { userId, organizationId, questionsAsked = 0, articlesViewed = 0, tokensUsed = 0 } = params;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    await prisma.usageStats.upsert({
      where: { userId_date: { userId, date: today } },
      create: {
        userId,
        organizationId,
        date: today,
        questionsAsked,
        articlesViewed,
        tokensUsed,
      },
      update: {
        questionsAsked: { increment: questionsAsked },
        articlesViewed: { increment: articlesViewed },
        tokensUsed: { increment: tokensUsed },
      },
    });
  } catch (err) {
    logger.warn('UsageStats upsert failed:', err);
  }
}
