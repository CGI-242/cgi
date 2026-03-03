import prisma from '../utils/prisma';
import { createLogger } from '../utils/logger';
import { PlanName, PLAN_QUOTAS, isPlanAtLeast, isUnlimited, isPaidPlan, calculateTotalPrice, getUnitPrice } from '../types/plans';
import { cacheService, CACHE_PREFIX } from '../utils/cache';
import { EmailService } from './email.service';
import { PushService } from './push.service';

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
export async function activateSubscription(orgId: string, plan: PlanName, paidSeats: number) {
  if (plan === 'FREE') {
    throw new Error('Impossible d\'activer un plan gratuit');
  }

  const sub = await prisma.subscription.findUnique({ where: { organizationId: orgId } });
  if (!sub) throw new Error('Abonnement introuvable');

  // Vérifier que paidSeats >= nombre de membres actuels
  const memberCount = await prisma.organizationMember.count({ where: { organizationId: orgId } });
  if (paidSeats < memberCount) {
    throw new Error(`Le nombre de sièges (${paidSeats}) ne peut pas être inférieur au nombre de membres actuels (${memberCount})`);
  }

  const quota = PLAN_QUOTAS[plan];
  const now = new Date();
  const oneYearLater = new Date(now);
  oneYearLater.setFullYear(now.getFullYear() + 1);

  const totalPrice = calculateTotalPrice(plan, paidSeats);

  const updated = await prisma.subscription.update({
    where: { id: sub.id },
    data: {
      plan,
      status: 'ACTIVE',
      questionsPerMonth: quota.questionsPerMonth, // quota par user (référence)
      questionsUsed: 0,
      maxMembers: quota.maxMembers,
      paidSeats,
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
  logger.info(`Abonnement activé: ${plan} pour org ${orgId} — ${paidSeats} sièges (${memberCount} membres) — ${totalPrice} XAF — valide jusqu'au ${oneYearLater.toISOString().split('T')[0]}`);
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
      paidSeats: sub.paidSeats,
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
    paidSeats: sub.paidSeats,
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

// ==================== SEAT REQUESTS ====================

/**
 * OWNER demande des sièges supplémentaires.
 * Crée une demande PENDING et notifie les admins.
 */
export async function requestAdditionalSeats(orgId: string, userId: string, additionalSeats: number) {
  const sub = await prisma.subscription.findUnique({ where: { organizationId: orgId } });
  if (!sub) throw new Error('Abonnement introuvable');

  const plan = sub.plan as PlanName;
  if (!isPaidPlan(plan)) {
    throw new Error('Un plan payant est requis pour demander des sièges supplémentaires');
  }
  if (sub.status !== 'ACTIVE') {
    throw new Error('L\'abonnement doit être actif pour demander des sièges supplémentaires');
  }

  // Vérifier qu'aucune demande PENDING n'existe déjà
  const existing = await prisma.seatRequest.findFirst({
    where: { organizationId: orgId, status: 'PENDING' },
  });
  if (existing) {
    throw new Error('Une demande de sièges est déjà en cours');
  }

  const currentSeats = sub.paidSeats;
  const totalSeatsAfter = currentSeats + additionalSeats;
  const unitPrice = getUnitPrice(plan, totalSeatsAfter);
  const totalPrice = additionalSeats * unitPrice;

  const request = await prisma.seatRequest.create({
    data: {
      organizationId: orgId,
      requestedById: userId,
      additionalSeats,
      currentSeats,
      totalSeatsAfter,
      unitPrice,
      totalPrice,
      plan,
    },
  });

  // Notifier les admins (email + push)
  const org = await prisma.organization.findUnique({ where: { id: orgId }, select: { name: true } });
  const requester = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, firstName: true, lastName: true } });
  const admins = await prisma.user.findMany({ where: { role: 'ADMIN' }, select: { id: true, email: true } });

  const requesterName = [requester?.firstName, requester?.lastName].filter(Boolean).join(' ') || requester?.email || 'Utilisateur';

  for (const admin of admins) {
    EmailService.sendSeatRequestNotification(
      admin.email,
      org?.name || 'Organisation',
      requesterName,
      additionalSeats,
      unitPrice,
      totalPrice,
      plan,
    ).catch((err) => logger.error('Erreur envoi email seat request admin', err));

    PushService.sendToUser(admin.id, 'Demande de sièges', `${requesterName} demande ${additionalSeats} siège(s) pour ${org?.name || 'une organisation'}`, {
      type: 'seat_request',
      requestId: request.id,
    }).catch((err) => logger.error('Erreur envoi push seat request admin', err));
  }

  logger.info(`Demande de ${additionalSeats} siège(s) créée pour org ${orgId} par user ${userId} — prix: ${totalPrice} XAF`);
  return request;
}

/**
 * Admin approuve une demande de sièges.
 * Met à jour paidSeats et notifie le OWNER.
 */
export async function approveSeatsRequest(requestId: string, adminId: string) {
  const request = await prisma.seatRequest.findUnique({
    where: { id: requestId },
    include: { organization: { select: { name: true } } },
  });
  if (!request) throw new Error('Demande introuvable');
  if (request.status !== 'PENDING') throw new Error('Cette demande a déjà été traitée');

  const sub = await prisma.subscription.findUnique({ where: { organizationId: request.organizationId } });
  if (!sub) throw new Error('Abonnement introuvable');

  // Mettre à jour en transaction
  await prisma.$transaction([
    prisma.subscription.update({
      where: { id: sub.id },
      data: { paidSeats: { increment: request.additionalSeats } },
    }),
    prisma.seatRequest.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        processedAt: new Date(),
        processedById: adminId,
      },
    }),
  ]);

  cacheService.del(`${CACHE_PREFIX.SUBSCRIPTION}${request.organizationId}`);

  // Notifier le OWNER
  const requester = await prisma.user.findUnique({ where: { id: request.requestedById }, select: { id: true, email: true } });
  if (requester) {
    const newTotal = sub.paidSeats + request.additionalSeats;
    EmailService.sendSeatRequestApproved(
      requester.email,
      request.organization.name,
      request.additionalSeats,
      newTotal,
    ).catch((err) => logger.error('Erreur envoi email seat approved', err));

    PushService.sendToUser(requester.id, 'Sièges approuvés', `Votre demande de ${request.additionalSeats} siège(s) a été approuvée. Total : ${newTotal} sièges.`, {
      type: 'seat_request_approved',
      requestId: request.id,
    }).catch((err) => logger.error('Erreur envoi push seat approved', err));
  }

  logger.info(`Demande de sièges ${requestId} approuvée par admin ${adminId} — +${request.additionalSeats} sièges pour org ${request.organizationId}`);
  return { ...request, status: 'APPROVED' as const };
}

/**
 * Admin rejette une demande de sièges.
 */
export async function rejectSeatsRequest(requestId: string, adminId: string, note?: string) {
  const request = await prisma.seatRequest.findUnique({
    where: { id: requestId },
    include: { organization: { select: { name: true } } },
  });
  if (!request) throw new Error('Demande introuvable');
  if (request.status !== 'PENDING') throw new Error('Cette demande a déjà été traitée');

  await prisma.seatRequest.update({
    where: { id: requestId },
    data: {
      status: 'REJECTED',
      adminNote: note || null,
      processedAt: new Date(),
      processedById: adminId,
    },
  });

  // Notifier le OWNER
  const requester = await prisma.user.findUnique({ where: { id: request.requestedById }, select: { id: true, email: true } });
  if (requester) {
    EmailService.sendSeatRequestRejected(
      requester.email,
      request.organization.name,
      request.additionalSeats,
      note,
    ).catch((err) => logger.error('Erreur envoi email seat rejected', err));

    PushService.sendToUser(requester.id, 'Sièges refusés', `Votre demande de ${request.additionalSeats} siège(s) a été refusée.${note ? ` Motif : ${note}` : ''}`, {
      type: 'seat_request_rejected',
      requestId: request.id,
    }).catch((err) => logger.error('Erreur envoi push seat rejected', err));
  }

  logger.info(`Demande de sièges ${requestId} rejetée par admin ${adminId}${note ? ` — note: ${note}` : ''}`);
  return { ...request, status: 'REJECTED' as const, adminNote: note || null };
}

/**
 * Liste les demandes de sièges PENDING (pour l'admin).
 */
export async function getPendingSeatsRequests() {
  return prisma.seatRequest.findMany({
    where: { status: 'PENDING' },
    include: {
      organization: { select: { id: true, name: true, slug: true } },
      requestedBy: { select: { id: true, email: true, firstName: true, lastName: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}
