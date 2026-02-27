import prisma from '../utils/prisma';
import { createLogger } from '../utils/logger';
import { PlanName, PLAN_QUOTAS, isPlanAtLeast, isUnlimited, calculateTotalPrice } from '../types/plans';
import { cacheService, CACHE_PREFIX } from '../utils/cache';

const logger = createLogger('SubscriptionService');

export async function getSubscription(orgId: string) {
  const sub = await prisma.subscription.findUnique({
    where: { organizationId: orgId },
  });
  if (!sub) throw new Error('Abonnement introuvable');

  await checkExpiry(sub);
  return sub;
}

/**
 * Activation manuelle d'un abonnement après réception du paiement.
 * Définit le plan, active pour 1 an à partir d'aujourd'hui.
 * Le questionsPerMonth sur Subscription sert de référence (quota par user).
 */
export async function activateSubscription(orgId: string, plan: PlanName) {
  if (plan === 'FREE') {
    throw new Error('Impossible d\'activer un plan gratuit');
  }

  const sub = await prisma.subscription.findUnique({ where: { organizationId: orgId } });
  if (!sub) throw new Error('Abonnement introuvable');

  const quota = PLAN_QUOTAS[plan];
  const now = new Date();
  const oneYearLater = new Date(now);
  oneYearLater.setFullYear(now.getFullYear() + 1);

  // Compter les membres pour le log
  const memberCount = await prisma.organizationMember.count({ where: { organizationId: orgId } });
  const totalPrice = calculateTotalPrice(plan, memberCount);

  const updated = await prisma.subscription.update({
    where: { id: sub.id },
    data: {
      plan,
      status: 'ACTIVE',
      questionsPerMonth: quota.questionsPerMonth, // quota par user (référence)
      questionsUsed: 0,
      maxMembers: quota.maxMembers,
      currentPeriodStart: now,
      currentPeriodEnd: oneYearLater,
    },
  });

  // Reset les quotas individuels de tous les membres
  await prisma.organizationMember.updateMany({
    where: { organizationId: orgId },
    data: { questionsUsed: 0 },
  });

  cacheService.del(`${CACHE_PREFIX.SUBSCRIPTION}${orgId}`);
  logger.info(`Abonnement activé: ${plan} pour org ${orgId} — ${memberCount} membres — ${totalPrice} XAF — valide jusqu'au ${oneYearLater.toISOString().split('T')[0]}`);
  return updated;
}

/**
 * Renouvellement : réactive pour 1 an supplémentaire.
 */
export async function renewSubscription(orgId: string) {
  const sub = await prisma.subscription.findUnique({ where: { organizationId: orgId } });
  if (!sub) throw new Error('Abonnement introuvable');

  const plan = sub.plan as PlanName;
  if (plan === 'FREE') {
    throw new Error('Impossible de renouveler un plan gratuit');
  }

  const now = new Date();
  const oneYearLater = new Date(now);
  oneYearLater.setFullYear(now.getFullYear() + 1);

  const updated = await prisma.subscription.update({
    where: { id: sub.id },
    data: {
      status: 'ACTIVE',
      questionsUsed: 0,
      currentPeriodStart: now,
      currentPeriodEnd: oneYearLater,
    },
  });

  // Reset les quotas individuels
  await prisma.organizationMember.updateMany({
    where: { organizationId: orgId },
    data: { questionsUsed: 0 },
  });

  cacheService.del(`${CACHE_PREFIX.SUBSCRIPTION}${orgId}`);
  logger.info(`Abonnement renouvelé: ${plan} pour org ${orgId} — valide jusqu'au ${oneYearLater.toISOString().split('T')[0]}`);
  return updated;
}

export async function upgradePlan(orgId: string, newPlan: PlanName) {
  const sub = await prisma.subscription.findUnique({ where: { organizationId: orgId } });
  if (!sub) throw new Error('Abonnement introuvable');

  const currentPlan = sub.plan as PlanName;
  if (!isPlanAtLeast(newPlan, currentPlan)) {
    throw new Error(`Le plan ${newPlan} n'est pas supérieur au plan actuel ${currentPlan}`);
  }
  if (newPlan === currentPlan) {
    throw new Error('Vous êtes déjà sur ce plan');
  }

  const quota = PLAN_QUOTAS[newPlan];
  const updated = await prisma.subscription.update({
    where: { id: sub.id },
    data: {
      plan: newPlan,
      questionsPerMonth: quota.questionsPerMonth,
      maxMembers: quota.maxMembers,
    },
  });

  cacheService.del(`${CACHE_PREFIX.SUBSCRIPTION}${orgId}`);
  logger.info(`Plan upgradé: ${currentPlan} -> ${newPlan} pour org ${orgId}`);
  return updated;
}

/**
 * Vérifie le quota d'un utilisateur (pas de l'org).
 */
export async function checkQuota(orgId: string, userId?: string) {
  const sub = await prisma.subscription.findUnique({ where: { organizationId: orgId } });
  if (!sub) throw new Error('Abonnement introuvable');

  await checkExpiry(sub);

  const questionsPerMonth = sub.questionsPerMonth;

  // Si userId fourni, retourner le quota individuel
  if (userId) {
    const member = await prisma.organizationMember.findUnique({
      where: { userId_organizationId: { userId, organizationId: orgId } },
    });
    const userUsed = member?.questionsUsed || 0;
    await lazyResetMemberIfNewMonth(orgId);

    return {
      plan: sub.plan,
      questionsUsed: userUsed,
      questionsPerMonth,
      remaining: isUnlimited(questionsPerMonth) ? -1 : questionsPerMonth - userUsed,
      isUnlimited: isUnlimited(questionsPerMonth),
      currentPeriodStart: sub.currentPeriodStart,
      currentPeriodEnd: sub.currentPeriodEnd,
      status: sub.status,
    };
  }

  // Fallback : quota global org (pour rétrocompatibilité)
  return {
    plan: sub.plan,
    questionsUsed: sub.questionsUsed,
    questionsPerMonth,
    remaining: isUnlimited(questionsPerMonth) ? -1 : questionsPerMonth - sub.questionsUsed,
    isUnlimited: isUnlimited(questionsPerMonth),
    currentPeriodStart: sub.currentPeriodStart,
    currentPeriodEnd: sub.currentPeriodEnd,
    status: sub.status,
  };
}

/**
 * Incrémente le quota d'un utilisateur spécifique dans son organisation.
 */
export async function incrementQuota(orgId: string, userId: string) {
  await lazyResetMemberIfNewMonth(orgId);

  await prisma.organizationMember.updateMany({
    where: { userId, organizationId: orgId },
    data: { questionsUsed: { increment: 1 } },
  });

  // Aussi incrémenter sur Subscription pour le suivi global admin
  await prisma.subscription.update({
    where: { organizationId: orgId },
    data: { questionsUsed: { increment: 1 } },
  }).catch(() => {});

  cacheService.del(`${CACHE_PREFIX.SUBSCRIPTION}${orgId}`);
}

/**
 * Vérifie si l'abonnement (annuel ou essai) a expiré.
 */
async function checkExpiry(sub: { id: string; plan: string; status: string; currentPeriodEnd: Date | null; organizationId: string | null }) {
  if (sub.status === 'EXPIRED' || sub.status === 'CANCELLED') return;
  if (!sub.currentPeriodEnd) return;

  const now = new Date();
  if (now > new Date(sub.currentPeriodEnd)) {
    const label = sub.status === 'TRIALING' ? 'Essai expiré' : 'Abonnement expiré';
    logger.info(`${label} pour sub ${sub.id}`);
    await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        status: 'EXPIRED',
        plan: 'FREE',
        questionsPerMonth: 0,
        questionsUsed: 0,
      },
    });
    sub.status = 'EXPIRED';
    sub.plan = 'FREE';

    if (sub.organizationId) {
      cacheService.del(`${CACHE_PREFIX.SUBSCRIPTION}${sub.organizationId}`);
    }
  }
}

/**
 * Lazy reset mensuel : si nouveau mois, remet les questionsUsed de tous les membres à 0.
 */
async function lazyResetMemberIfNewMonth(orgId: string) {
  const sub = await prisma.subscription.findUnique({ where: { organizationId: orgId } });
  if (!sub) return;

  const now = new Date();
  const periodStart = new Date(sub.currentPeriodStart);
  if (now.getFullYear() !== periodStart.getFullYear() || now.getMonth() !== periodStart.getMonth()) {
    logger.info(`Lazy reset quotas pour org ${orgId} (tous les membres)`);

    await prisma.organizationMember.updateMany({
      where: { organizationId: orgId },
      data: { questionsUsed: 0 },
    });

    await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        questionsUsed: 0,
        currentPeriodStart: new Date(now.getFullYear(), now.getMonth(), 1),
      },
    });

    cacheService.del(`${CACHE_PREFIX.SUBSCRIPTION}${orgId}`);
  }
}
