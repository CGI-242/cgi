import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import prisma from '../utils/prisma';
import { createLogger } from '../utils/logger';

const logger = createLogger('RequireAdmin');

/**
 * Middleware admin global : vérifie que l'utilisateur a le rôle ADMIN
 * en base de données. Fallback sur ADMIN_EMAIL pour rétro-compatibilité
 * (promeut automatiquement l'utilisateur en ADMIN si match).
 */
export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.userId) {
    res.status(401).json({ error: 'Authentification requise' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      res.status(401).json({ error: 'Utilisateur introuvable' });
      return;
    }

    // Vérification principale : rôle en base
    if (user.role === 'ADMIN') {
      next();
      return;
    }

    // Fallback rétro-compatible : ADMIN_EMAIL env var
    // Si match, promouvoir l'utilisateur en ADMIN en base pour les prochaines requêtes
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && user.email === adminEmail) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' },
      });
      logger.info(`Utilisateur ${user.email} promu ADMIN (migration depuis ADMIN_EMAIL)`);
      next();
      return;
    }

    logger.warn(`Tentative d'accès admin refusée pour ${req.userEmail}`);
    res.status(403).json({ error: 'Accès refusé — droits administrateur requis' });
  } catch (err) {
    logger.error('Erreur vérification admin:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
