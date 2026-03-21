import { Expo, type ExpoPushMessage, type ExpoPushTicket, type ExpoPushReceiptId } from "expo-server-sdk";
import prisma from "../utils/prisma";
import { createLogger } from "../utils/logger";

const logger = createLogger("PushService");
const expo = new Expo();

export class PushService {
  /**
   * Envoie une notification push à tous les appareils d'un utilisateur.
   * Nettoie automatiquement les tokens invalides (DeviceNotRegistered).
   */
  static async sendToUser(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, unknown>,
    channelId?: string
  ): Promise<void> {
    try {
      const tokens = await prisma.pushToken.findMany({
        where: { userId },
        select: { token: true },
      });

      if (tokens.length === 0) return;

      const validTokens = tokens.filter((t) => Expo.isExpoPushToken(t.token));
      if (validTokens.length === 0) return;

      const messages: ExpoPushMessage[] = validTokens.map((t) => ({
        to: t.token,
        sound: "default" as const,
        title,
        body,
        data,
        channelId: channelId || "general",
        priority: "high" as const,
      }));

      const chunks = expo.chunkPushNotifications(messages);
      const ticketIds: ExpoPushReceiptId[] = [];

      for (const chunk of chunks) {
        try {
          const tickets = await expo.sendPushNotificationsAsync(chunk);
          logger.info(`Push envoyé à ${userId}: ${tickets.length} tickets`);

          // Collecter les ticket IDs pour vérification ultérieure
          for (let i = 0; i < tickets.length; i++) {
            const ticket = tickets[i];
            if (ticket.status === "error") {
              // Token invalide → supprimer immédiatement
              if (ticket.details?.error === "DeviceNotRegistered") {
                const badToken = validTokens[i]?.token;
                if (badToken) {
                  await PushService.unregisterToken(badToken);
                  logger.info(`Token invalide supprimé: ${badToken.slice(0, 20)}...`);
                }
              } else {
                logger.error(`Erreur ticket push: ${ticket.message}`);
              }
            } else if (ticket.status === "ok" && ticket.id) {
              ticketIds.push(ticket.id);
            }
          }
        } catch (err) {
          logger.error("Erreur envoi push chunk", err);
        }
      }

      // Vérifier les receipts après un délai (Expo recommande 15min)
      if (ticketIds.length > 0) {
        setTimeout(() => PushService.checkReceipts(ticketIds), 15 * 60 * 1000);
      }
    } catch (err) {
      logger.error(`Erreur envoi push à ${userId}`, err);
    }
  }

  /**
   * Envoie une notification de masse à plusieurs utilisateurs.
   */
  static async sendToMany(
    userIds: string[],
    title: string,
    body: string,
    data?: Record<string, unknown>,
    channelId?: string
  ): Promise<{ sent: number; errors: number }> {
    const result = { sent: 0, errors: 0 };

    for (const userId of userIds) {
      try {
        await PushService.sendToUser(userId, title, body, data, channelId);
        result.sent++;
      } catch {
        result.errors++;
      }
    }

    return result;
  }

  /**
   * Notification spécialisée : échéances fiscales.
   */
  static async sendFiscalDeadlinesPush(
    userId: string,
    deadlines: Array<{ titre: string; description: string }>
  ): Promise<void> {
    if (deadlines.length === 0) return;

    const title = "Échéances fiscales à venir";
    const body =
      deadlines.length === 1
        ? deadlines[0].titre
        : `${deadlines.length} échéances fiscales à venir`;

    await PushService.sendToUser(userId, title, body, {
      type: "fiscal_deadlines",
      count: deadlines.length,
    }, "fiscal");
  }

  /**
   * Notification spécialisée : abonnement expirant.
   */
  static async sendSubscriptionExpiringPush(
    userId: string,
    orgName: string,
    plan: string,
    daysLeft: number
  ): Promise<void> {
    const title = daysLeft === 0
      ? "Abonnement expiré"
      : `Abonnement expire dans ${daysLeft} jour${daysLeft > 1 ? "s" : ""}`;
    const body = `Votre abonnement ${plan} pour ${orgName} ${daysLeft === 0 ? "a expiré aujourd'hui" : `expire dans ${daysLeft} jour${daysLeft > 1 ? "s" : ""}`}. Renouvelez pour ne pas perdre l'accès.`;

    await PushService.sendToUser(userId, title, body, {
      type: "subscription_expiring",
      daysLeft,
      plan,
    });
  }

  /**
   * Enregistre ou met à jour un token push.
   */
  static async registerToken(
    userId: string,
    token: string,
    platform: string = "unknown"
  ): Promise<void> {
    await prisma.pushToken.upsert({
      where: { token },
      create: { userId, token, platform },
      update: { userId, platform, updatedAt: new Date() },
    });
    logger.info(`Token push enregistré pour ${userId} (${platform})`);
  }

  /**
   * Supprime un token push.
   */
  static async unregisterToken(token: string): Promise<void> {
    await prisma.pushToken.deleteMany({ where: { token } });
    logger.info(`Token push supprimé: ${token.slice(0, 20)}...`);
  }

  /**
   * Supprime tous les tokens d'un utilisateur (ex: suppression de compte).
   */
  static async unregisterAllForUser(userId: string): Promise<void> {
    const { count } = await prisma.pushToken.deleteMany({ where: { userId } });
    if (count > 0) {
      logger.info(`${count} token(s) push supprimé(s) pour ${userId}`);
    }
  }

  /**
   * Vérifie les receipts Expo pour nettoyer les tokens invalides.
   * Appelé automatiquement 15min après l'envoi.
   */
  private static async checkReceipts(ticketIds: ExpoPushReceiptId[]): Promise<void> {
    try {
      const chunks = expo.chunkPushNotificationReceiptIds(ticketIds);

      for (const chunk of chunks) {
        const receipts = await expo.getPushNotificationReceiptsAsync(chunk);

        for (const [, receipt] of Object.entries(receipts)) {
          if (receipt.status === "error") {
            if (receipt.details?.error === "DeviceNotRegistered") {
              // Le token dans le message original n'est plus valide
              // On ne peut pas retrouver le token depuis le receipt,
              // mais le token a déjà été nettoyé au moment de l'envoi si possible
              logger.warn("Receipt DeviceNotRegistered détecté");
            } else {
              logger.error(`Receipt erreur: ${receipt.message}`);
            }
          }
        }
      }
    } catch (err) {
      logger.error("Erreur vérification receipts push", err);
    }
  }

  /**
   * Nettoie les tokens obsolètes (pas mis à jour depuis 90 jours).
   * À appeler périodiquement (cron hebdomadaire).
   */
  static async cleanupStaleTokens(): Promise<number> {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { count } = await prisma.pushToken.deleteMany({
      where: { updatedAt: { lt: ninetyDaysAgo } },
    });

    if (count > 0) {
      logger.info(`${count} token(s) push obsolète(s) supprimé(s)`);
    }

    return count;
  }
}
