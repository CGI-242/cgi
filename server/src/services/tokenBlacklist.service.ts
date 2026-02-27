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
   * Blackliste tous les tokens d'un utilisateur
   * Stocke un timestamp : tout token émis avant ce timestamp est invalide
   */
  static blacklistAllUserTokens(userId: string): void {
    const key = `${CACHE_PREFIX.BLACKLIST}user:${userId}`;
    cacheService.set(key, Date.now(), CACHE_TTL.TOKEN_BLACKLIST);
    logger.info(`Tous les tokens blacklistés pour user ${userId}`);
  }

  /**
   * Vérifie si les tokens d'un utilisateur ont été révoqués globalement
   */
  static isUserBlacklisted(userId: string, tokenIssuedAt: number): boolean {
    const key = `${CACHE_PREFIX.BLACKLIST}user:${userId}`;
    const blacklistedAt = cacheService.get<number>(key);
    if (!blacklistedAt) return false;
    // Token émis avant le blacklist → invalide
    return tokenIssuedAt * 1000 <= blacklistedAt;
  }
}
