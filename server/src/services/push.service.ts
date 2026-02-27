import { Expo, type ExpoPushMessage } from "expo-server-sdk";
import prisma from "../utils/prisma";
import { createLogger } from "../utils/logger";

const logger = createLogger("PushService");
const expo = new Expo();

export class PushService {
  static async sendToUser(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, unknown>
  ): Promise<void> {
    try {
      const tokens = await prisma.pushToken.findMany({
        where: { userId },
        select: { token: true },
      });

      if (tokens.length === 0) return;

      const messages: ExpoPushMessage[] = tokens
        .filter((t) => Expo.isExpoPushToken(t.token))
        .map((t) => ({
          to: t.token,
          sound: "default" as const,
          title,
          body,
          data,
        }));

      if (messages.length === 0) return;

      const chunks = expo.chunkPushNotifications(messages);

      for (const chunk of chunks) {
        try {
          const tickets = await expo.sendPushNotificationsAsync(chunk);
          logger.info(`Push envoyé à ${userId}: ${tickets.length} tickets`);
        } catch (err) {
          logger.error("Erreur envoi push chunk", err);
        }
      }
    } catch (err) {
      logger.error(`Erreur envoi push à ${userId}`, err);
    }
  }

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
    });
  }

  static async registerToken(
    userId: string,
    token: string,
    platform: string = "unknown"
  ): Promise<void> {
    await prisma.pushToken.upsert({
      where: { token },
      create: { userId, token, platform },
      update: { userId, platform },
    });
    logger.info(`Token push enregistré pour ${userId} (${platform})`);
  }

  static async unregisterToken(token: string): Promise<void> {
    await prisma.pushToken.deleteMany({ where: { token } });
    logger.info(`Token push supprimé: ${token.slice(0, 20)}...`);
  }
}
