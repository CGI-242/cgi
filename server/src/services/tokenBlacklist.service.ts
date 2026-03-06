import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
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
   * Stocke un timestamp en secondes (comme JWT iat) en cache ET en base de données.
   */
  static blacklistAllUserTokens(userId: string): void {
    const nowSec = Math.floor(Date.now() / 1000);
    const key = `${CACHE_PREFIX.BLACKLIST}user:${userId}`;
    cacheService.set(key, nowSec, CACHE_TTL.TOKEN_BLACKLIST);

    // Persister en base pour survivre aux redémarrages du serveur
    prisma.user.update({
      where: { id: userId },
      data: { tokenRevokedAt: new Date(nowSec * 1000) },
    }).catch((err: unknown) => {
      logger.error('Erreur persistance tokenRevokedAt', err);
    });

    logger.info(`Tous les tokens blacklistés pour user ${userId}`);
  }

  /**
   * Vérifie si les tokens d'un utilisateur ont été révoqués globalement.
   * Compare iat (secondes) vs tokenRevokedAt (secondes). Tokens émis AVANT la révocation sont invalides.
   */
  static isUserBlacklisted(userId: string, tokenIssuedAt: number): boolean {
    const key = `${CACHE_PREFIX.BLACKLIST}user:${userId}`;
    const blacklistedAtSec = cacheService.get<number>(key);
    if (blacklistedAtSec) {
      return tokenIssuedAt < blacklistedAtSec;
    }
    return false;
  }

  /**
   * Vérifie la révocation (cache + base de données).
   * Version asynchrone pour le middleware auth.
   */
  static async isUserBlacklistedAsync(userId: string, tokenIssuedAt: number): Promise<boolean> {
    const key = `${CACHE_PREFIX.BLACKLIST}user:${userId}`;
    const blacklistedAtSec = cacheService.get<number>(key);
    if (blacklistedAtSec) {
      return tokenIssuedAt < blacklistedAtSec;
    }

    // Fallback : vérifier en base de données
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { tokenRevokedAt: true },
      });
      if (user?.tokenRevokedAt) {
        const revokedAtSec = Math.floor(new Date(user.tokenRevokedAt).getTime() / 1000);
        // Re-hydrater le cache (en secondes)
        cacheService.set(key, revokedAtSec, CACHE_TTL.TOKEN_BLACKLIST);
        return tokenIssuedAt < revokedAtSec;
      }
    } catch (err) {
      logger.error('Erreur vérification tokenRevokedAt en base', err);
    }
    return false;
  }
}
