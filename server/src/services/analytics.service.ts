import prisma from '../utils/prisma';
import { createLogger } from '../utils/logger';

const logger = createLogger('AnalyticsService');

export async function getDashboard(orgId: string) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);
  const sixtyDaysAgo = new Date(now);
  sixtyDaysAgo.setDate(now.getDate() - 60);

  // Période courante (30 derniers jours)
  const [currentStats, previousStats, sub, memberCount] = await Promise.all([
    prisma.usageStats.aggregate({
      where: { organizationId: orgId, date: { gte: thirtyDaysAgo } },
      _sum: { questionsAsked: true, articlesViewed: true, tokensUsed: true },
    }),
    // Période précédente (30-60 jours)
    prisma.usageStats.aggregate({
      where: { organizationId: orgId, date: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
      _sum: { questionsAsked: true, articlesViewed: true, tokensUsed: true },
    }),
    prisma.subscription.findUnique({ where: { organizationId: orgId } }),
    prisma.organizationMember.count({ where: { organizationId: orgId } }),
  ]);

  const currentQuestions = currentStats._sum.questionsAsked || 0;
  const previousQuestions = previousStats._sum.questionsAsked || 0;
  const questionsTrend = previousQuestions > 0
    ? Math.round(((currentQuestions - previousQuestions) / previousQuestions) * 100)
    : currentQuestions > 0 ? 100 : 0;

  return {
    period: { from: thirtyDaysAgo, to: now },
    current: {
      questions: currentQuestions,
      articlesViewed: currentStats._sum.articlesViewed || 0,
      tokensUsed: currentStats._sum.tokensUsed || 0,
    },
    previous: {
      questions: previousQuestions,
      articlesViewed: previousStats._sum.articlesViewed || 0,
      tokensUsed: previousStats._sum.tokensUsed || 0,
    },
    trends: {
      questions: questionsTrend,
    },
    subscription: sub ? {
      plan: sub.plan,
      questionsUsed: sub.questionsUsed,
      questionsPerMonth: sub.questionsPerMonth,
    } : null,
    memberCount,
  };
}

export async function getTimeSeries(orgId: string, days: number = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const stats = await prisma.usageStats.findMany({
    where: { organizationId: orgId, date: { gte: since } },
    orderBy: { date: 'asc' },
    select: { date: true, questionsAsked: true, articlesViewed: true, tokensUsed: true },
  });

  return stats;
}

export async function getMemberStats(orgId: string) {
  const members = await prisma.organizationMember.findMany({
    where: { organizationId: orgId },
    include: {
      user: { select: { id: true, email: true, firstName: true, lastName: true, lastLoginAt: true } },
    },
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const memberStats = await Promise.all(
    members.map(async (m) => {
      const [messageCount, searchCount] = await Promise.all([
        prisma.message.count({
          where: {
            authorId: m.userId,
            role: 'USER',
            conversation: { organizationId: orgId },
            createdAt: { gte: thirtyDaysAgo },
          },
        }),
        prisma.searchHistory.count({
          where: { userId: m.userId, createdAt: { gte: thirtyDaysAgo } },
        }),
      ]);

      return {
        user: m.user,
        role: m.role,
        questionsUsed: m.questionsUsed,
        messagesLast30d: messageCount,
        searchesLast30d: searchCount,
        joinedAt: m.joinedAt,
      };
    })
  );

  return memberStats;
}

export async function exportCsv(orgId: string, days: number = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const stats = await prisma.usageStats.findMany({
    where: { organizationId: orgId, date: { gte: since } },
    orderBy: { date: 'asc' },
  });

  const header = 'date,questionsAsked,articlesViewed,tokensUsed';
  const rows = stats.map(s => {
    const d = s.date instanceof Date ? s.date.toISOString().split('T')[0] : s.date;
    return `${d},${s.questionsAsked},${s.articlesViewed},${s.tokensUsed}`;
  });

  return [header, ...rows].join('\n');
}
