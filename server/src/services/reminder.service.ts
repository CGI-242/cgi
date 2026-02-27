// server/src/services/reminder.service.ts
// Service d'emails de rappel : expiration abonnement, renouvellement, échéances fiscales

import prisma from '../utils/prisma';
import { EmailService } from './email.service';
import { createLogger } from '../utils/logger';

const logger = createLogger('ReminderService');

/**
 * Vérifie les abonnements proches de l'expiration et envoie des rappels.
 * À appeler périodiquement (cron ou setInterval).
 *
 * Rappels envoyés :
 * - 30 jours avant expiration
 * - 7 jours avant expiration
 * - 1 jour avant expiration
 * - Le jour de l'expiration
 */
export async function checkExpiringSubscriptions(): Promise<{ sent: number; errors: number }> {
  const now = new Date();
  const result = { sent: 0, errors: 0 };

  const thresholds = [
    { days: 30, label: '30 jours' },
    { days: 7, label: '7 jours' },
    { days: 1, label: '1 jour' },
    { days: 0, label: "aujourd'hui" },
  ];

  for (const threshold of thresholds) {
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + threshold.days);
    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    try {
      const subscriptions = await prisma.subscription.findMany({
        where: {
          status: { in: ['ACTIVE', 'TRIALING'] },
          plan: { not: 'FREE' },
          currentPeriodEnd: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
        include: {
          organization: {
            include: {
              members: {
                where: { role: { in: ['OWNER', 'ADMIN'] } },
                include: { user: { select: { email: true } } },
              },
            },
          },
        },
      });

      for (const sub of subscriptions) {
        if (!sub.organization) continue;

        const orgName = sub.organization.name;
        const expiryDate = sub.currentPeriodEnd
          ? new Date(sub.currentPeriodEnd).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : 'inconnue';

        // Envoyer aux OWNER et ADMIN de l'org
        for (const member of sub.organization.members) {
          try {
            await EmailService.sendSubscriptionReminder(
              member.user.email,
              orgName,
              sub.plan,
              expiryDate,
              threshold.days,
            );
            result.sent++;
          } catch (err) {
            logger.error(`Erreur envoi rappel à ${member.user.email}:`, err);
            result.errors++;
          }
        }
      }
    } catch (err) {
      logger.error(`Erreur vérification seuil ${threshold.days}j:`, err);
      result.errors++;
    }
  }

  if (result.sent > 0) {
    logger.info(`Rappels envoyés: ${result.sent} emails, ${result.errors} erreurs`);
  }

  return result;
}

/**
 * Vérifie les échéances fiscales à venir et envoie des rappels.
 * Dates clés du CGI : acomptes IS, déclarations, etc.
 */
export async function checkFiscalDeadlines(): Promise<{ sent: number; errors: number }> {
  const now = new Date();
  const result = { sent: 0, errors: 0 };

  const FISCAL_DEADLINES = [
    { month: 2, day: 15, label: '1er acompte IS (15 février)' },
    { month: 3, day: 15, label: '1er acompte minimum de perception (15 mars)' },
    { month: 3, day: 31, label: 'Déclaration annuelle IS/IBA (31 mars)' },
    { month: 5, day: 15, label: '2e acompte IS (15 mai)' },
    { month: 6, day: 15, label: '2e acompte minimum de perception (15 juin)' },
    { month: 8, day: 15, label: '3e acompte IS (15 août)' },
    { month: 9, day: 15, label: '3e acompte minimum de perception (15 septembre)' },
    { month: 11, day: 15, label: '4e acompte IS (15 novembre)' },
    { month: 12, day: 15, label: '4e acompte minimum de perception (15 décembre)' },
  ];

  // Vérifier les échéances dans les 7 prochains jours
  const in7Days = new Date(now);
  in7Days.setDate(in7Days.getDate() + 7);

  const upcomingDeadlines = FISCAL_DEADLINES.filter((d) => {
    const deadline = new Date(now.getFullYear(), d.month - 1, d.day);
    return deadline >= now && deadline <= in7Days;
  });

  if (upcomingDeadlines.length === 0) return result;

  try {
    // Envoyer aux OWNER/ADMIN de toutes les orgs avec abonnement actif
    const activeOrgs = await prisma.organization.findMany({
      where: {
        deletedAt: null,
        subscription: { status: 'ACTIVE', plan: { not: 'FREE' } },
      },
      include: {
        members: {
          where: { role: { in: ['OWNER', 'ADMIN'] } },
          include: { user: { select: { email: true } } },
        },
      },
    });

    for (const org of activeOrgs) {
      for (const member of org.members) {
        try {
          await EmailService.sendFiscalDeadlineReminder(
            member.user.email,
            upcomingDeadlines.map((d) => d.label),
          );
          result.sent++;
        } catch (err) {
          logger.error(`Erreur envoi échéance fiscale à ${member.user.email}:`, err);
          result.errors++;
        }
      }
    }
  } catch (err) {
    logger.error('Erreur vérification échéances fiscales:', err);
    result.errors++;
  }

  if (result.sent > 0) {
    logger.info(`Rappels fiscaux envoyés: ${result.sent} emails`);
  }

  return result;
}

/**
 * Démarre le cron de vérification des rappels.
 * Exécution quotidienne à 8h00.
 */
export function startReminderCron(): void {
  const INTERVAL_MS = 24 * 60 * 60 * 1000; // 24h

  // Calculer le délai jusqu'à 8h00
  const now = new Date();
  const next8am = new Date(now);
  next8am.setHours(8, 0, 0, 0);
  if (now >= next8am) {
    next8am.setDate(next8am.getDate() + 1);
  }
  const delayMs = next8am.getTime() - now.getTime();

  logger.info(`Cron rappels programmé : première exécution dans ${Math.round(delayMs / 60000)} minutes (8h00)`);

  // Premier lancement à 8h00, puis toutes les 24h
  setTimeout(() => {
    runAllReminders();
    setInterval(runAllReminders, INTERVAL_MS);
  }, delayMs);
}

async function runAllReminders(): Promise<void> {
  logger.info('Exécution des rappels quotidiens...');
  try {
    await checkExpiringSubscriptions();
    await checkFiscalDeadlines();
  } catch (err) {
    logger.error('Erreur exécution rappels:', err);
  }
}
