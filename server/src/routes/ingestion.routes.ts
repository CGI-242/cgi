// server/src/routes/ingestion.routes.ts
// API REST protégée pour l'ingestion d'articles CGI dans PostgreSQL + Qdrant

import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { ingestArticles, ingestFromSource, type IngestionResult } from '../services/rag/ingestion.service';
import { createLogger } from '../utils/logger';

const logger = createLogger('IngestionRoutes');
const router = Router();

/**
 * Middleware admin : seul ADMIN_EMAIL peut ingérer des articles
 */
function requireAdmin(req: AuthRequest, res: Response, next: () => void) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    res.status(503).json({ error: 'Administration non configurée' });
    return;
  }
  if (req.userEmail !== adminEmail) {
    logger.warn(`Tentative d'ingestion refusée pour ${req.userEmail}`);
    res.status(403).json({ error: 'Accès refusé — droits administrateur requis' });
    return;
  }
  next();
}

/**
 * POST /api/ingestion/articles
 * Ingestion directe d'articles au format ArticleJSON[].
 *
 * Body : { articles: ArticleJSON[] }
 *
 * Chaque article :
 * {
 *   numero: string,      // ex: "86A"
 *   titre: string,       // ex: "Taux de l'impôt sur les sociétés"
 *   contenu: string,     // texte complet de l'article
 *   tome?: string,       // ex: "1"
 *   chapitre?: string,   // ex: "Chapitre 1 - IS"
 *   version?: string,    // ex: "2026" (défaut: "2026")
 *   keywords?: string[], // ex: ["IS", "taux", "28%"]
 *   livre?: string       // ex: "Livre 1"
 * }
 */
router.post('/articles', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { articles } = req.body;

    if (!articles || !Array.isArray(articles) || articles.length === 0) {
      res.status(400).json({ error: 'Le champ "articles" doit être un tableau non vide' });
      return;
    }

    // Validation basique
    for (let i = 0; i < articles.length; i++) {
      const a = articles[i];
      if (!a.numero || !a.titre || !a.contenu) {
        res.status(400).json({
          error: `Article index ${i} : les champs "numero", "titre" et "contenu" sont obligatoires`,
        });
        return;
      }
    }

    logger.info(`Ingestion demandée par ${req.userEmail} : ${articles.length} articles`);

    const result: IngestionResult = await ingestArticles(articles);

    logger.info(`Ingestion terminée : ${result.inserted} insérés, ${result.updated} mis à jour, ${result.errors} erreurs`);

    res.json({
      message: `Ingestion terminée : ${result.inserted} insérés, ${result.updated} mis à jour`,
      result,
    });
  } catch (err) {
    logger.error('Erreur ingestion articles:', err);
    res.status(500).json({ error: 'Erreur lors de l\'ingestion' });
  }
});

/**
 * POST /api/ingestion/sources
 * Ingestion depuis des fichiers source au format SourceFile[].
 *
 * Body : { sources: SourceFile[] }
 *
 * Chaque source :
 * {
 *   filename: string,
 *   articles: ArticleJSON[]
 * }
 */
router.post('/sources', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { sources } = req.body;

    if (!sources || !Array.isArray(sources) || sources.length === 0) {
      res.status(400).json({ error: 'Le champ "sources" doit être un tableau non vide' });
      return;
    }

    const totalArticles = sources.reduce((sum: number, s: { articles?: unknown[] }) => sum + (s.articles?.length || 0), 0);
    logger.info(`Ingestion sources demandée par ${req.userEmail} : ${sources.length} fichiers, ${totalArticles} articles`);

    const result: IngestionResult = await ingestFromSource(sources);

    logger.info(`Ingestion sources terminée : ${result.inserted} insérés, ${result.updated} mis à jour, ${result.errors} erreurs`);

    res.json({
      message: `Ingestion terminée : ${result.inserted} insérés, ${result.updated} mis à jour`,
      result,
    });
  } catch (err) {
    logger.error('Erreur ingestion sources:', err);
    res.status(500).json({ error: 'Erreur lors de l\'ingestion' });
  }
});

/**
 * GET /api/ingestion/stats
 * Statistiques sur les articles ingérés.
 */
router.get('/stats', requireAuth, requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const [totalArticles, byVersion, byTome, referencesCount] = await Promise.all([
      prisma.article.count(),
      prisma.article.groupBy({ by: ['version'], _count: { id: true } }),
      prisma.article.groupBy({ by: ['tome'], _count: { id: true } }),
      prisma.articleReference.count(),
    ]);

    res.json({
      totalArticles,
      byVersion: byVersion.reduce((acc, v) => ({ ...acc, [v.version]: v._count.id }), {} as Record<string, number>),
      byTome: byTome.reduce((acc, t) => ({ ...acc, [t.tome || 'inconnu']: t._count.id }), {} as Record<string, number>),
      totalReferences: referencesCount,
    });
  } catch (err) {
    logger.error('Erreur stats ingestion:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Prisma import pour les stats
import prisma from '../utils/prisma';

export default router;
