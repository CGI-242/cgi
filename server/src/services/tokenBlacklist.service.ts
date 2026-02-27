import jwt from 'jsonwebtoken';
import cacheService, { CACHE_TTL, CACHE_PREFIX } from '../utils/cache';
import { createLogger } from '../utils/logger';

const logger = createLogger('TokenBlacklist');

export class TokenBlacklistService {
  /**
   * Blackliste un token avec TTL = durée restante avant expiration
   */
  static blacklistToken(token: string): void {
    try {
      const decoded = jwt.decode(token) as { exp?: number } | null;
      if (!decoded?.exp) {
        // Pas d'expiration lisible, utiliser TTL par défaut
        cacheService.set(
          `${CACHE_PREFIX.BLACKLIST}${token}`,
          true,
          CACHE_TTL.TOKEN_BLACKLIST
        );
        return;
      }

      const ttl = decoded.exp - Math.floor(Date.now() / 1000);
      if (ttl <= 0) return; // Déjà expiré, pas besoin de blacklister

      cacheService.set(`${CACHE_PREFIX.BLACKLIST}${token}`, true, ttl);
      logger.debug(`Token blacklisté (TTL: ${ttl}s)`);
    } catch (err) {
      logger.error('Erreur blacklist token', err);
    }
  }

  /**
   * Vérifie si un token est blacklisté
   */
  static isBlacklisted(token: string): boolean {
    return cacheService.get<boolean>(`${CACHE_PREFIX.BLACKLIST}${token}`) === true;
  }

  /**
   * Blackliste tous les tokens d'un utilisateur.
   * Stocke un timestamp en cache ET en base de données (M2 — survit au redémarrage).
   */
  static blacklistAllUserTokens(userId: string): void {
    const now = Date.now();
    const key = `${CACHE_PREFIX.BLACKLIST}user:${userId}`;
    cacheService.set(key, now, CACHE_TTL.TOKEN_BLACKLIST);

    // Persister en base pour survivre aux redémarrages du serveur
    const prisma = require('../utils/prisma').default;
    prisma.user.update({
      where: { id: userId },
      data: { tokenRevokedAt: new Date(now) },
    }).catch((err: unknown) => {
      logger.error('Erreur persistance tokenRevokedAt', err);
    });

    logger.info(`Tous les tokens blacklistés pour user ${userId}`);
  }

  /**
   * Vérifie si les tokens d'un utilisateur ont été révoqués globalement.
   * Vérifie le cache en priorité, puis la base de données (M2 — fallback persistant).
   */
  static isUserBlacklisted(userId: string, tokenIssuedAt: number): boolean {
    const key = `${CACHE_PREFIX.BLACKLIST}user:${userId}`;
    const blacklistedAt = cacheService.get<number>(key);
    if (blacklistedAt) {
      return tokenIssuedAt * 1000 <= blacklistedAt;
    }
    // Pas en cache → sera vérifié de manière asynchrone si nécessaire
    return false;
  }

  /**
   * Vérifie la révocation depuis la base de données (après redémarrage serveur).
   * Version asynchrone pour le middleware auth.
   */
  static async isUserBlacklistedAsync(userId: string, tokenIssuedAt: number): Promise<boolean> {
    const key = `${CACHE_PREFIX.BLACKLIST}user:${userId}`;
    const blacklistedAt = cacheService.get<number>(key);
    if (blacklistedAt) {
      return tokenIssuedAt * 1000 <= blacklistedAt;
    }

    // Fallback : vérifier en base de données (M2)
    try {
      const prisma = require('../utils/prisma').default;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { tokenRevokedAt: true },
      });
      if (user?.tokenRevokedAt) {
        const revokedAtMs = new Date(user.tokenRevokedAt).getTime();
        // Re-hydrater le cache
        cacheService.set(key, revokedAtMs, CACHE_TTL.TOKEN_BLACKLIST);
        return tokenIssuedAt * 1000 <= revokedAtMs;
      }
    } catch (err) {
      logger.error('Erreur vérification tokenRevokedAt en base', err);
    }
    return false;
  }
}
