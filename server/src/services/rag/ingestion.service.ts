// server/src/services/rag/ingestion.service.ts
// Pipeline d'ingestion: JSON -> PostgreSQL + Qdrant
// Adapté de cgi-engine (sans Redis, sans uuid externe, Prisma direct)

import { PrismaClient } from '@prisma/client';
import { generateEmbeddings } from './embeddings.service';
import { initializeCollection, upsertArticleVectors, ArticleVector } from './qdrant.service';
import { createLogger } from '../../utils/logger';
import crypto from 'crypto';
import {
  ArticleJSON,
  SourceFile,
  transformSourceToArticles,
  prepareArticleText,
} from './ingestion.parsers';

export type { ArticleJSON, SourceFile } from './ingestion.parsers';

const logger = createLogger('IngestionService');
const prisma = new PrismaClient();

export interface IngestionResult {
  total: number;
  inserted: number;
  updated: number;
  errors: number;
  tokensUsed: number;
}

export async function ingestFromSource(sources: SourceFile[]): Promise<IngestionResult> {
  const allArticles: ArticleJSON[] = [];
  for (const source of sources) {
    allArticles.push(...transformSourceToArticles(source));
  }
  return ingestArticles(allArticles);
}

export async function ingestArticles(articles: ArticleJSON[]): Promise<IngestionResult> {
  const result: IngestionResult = {
    total: articles.length,
    inserted: 0,
    updated: 0,
    errors: 0,
    tokensUsed: 0,
  };

  await initializeCollection();
  logger.info(`Début ingestion de ${articles.length} articles`);

  const BATCH_SIZE = 20;

  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE);
    const texts = batch.map(prepareArticleText);

    try {
      const embeddings = await generateEmbeddings(texts);
      const vectors: ArticleVector[] = [];

      for (let j = 0; j < batch.length; j++) {
        const article = batch[j];
        const embedding = embeddings[j];
        result.tokensUsed += embedding.tokensUsed;

        try {
          const version = article.version || '2026';
          const tome = article.tome || '1';
          const livre = article.livre || '';

          // Chercher si l'article existe déjà
          const existing = await prisma.article.findFirst({
            where: {
              numero: article.numero,
              version: version,
            },
          });

          const articleData = {
            numero: article.numero,
            titre: article.titre,
            contenu: article.contenu,
            tome: tome,
            version: version,
            keywords: article.keywords || [],
          };

          let dbArticle;
          if (existing) {
            dbArticle = await prisma.article.update({
              where: { id: existing.id },
              data: articleData,
            });
            result.updated++;
          } else {
            dbArticle = await prisma.article.create({ data: articleData });
            result.inserted++;
          }

          vectors.push({
            id: crypto.randomUUID(),
            vector: embedding.embedding,
            payload: {
              articleId: dbArticle.id,
              numero: article.numero,
              titre: article.titre,
              contenu: article.contenu.substring(0, 1000),
              tome: article.tome,
              chapitre: article.chapitre,
              version: version,
              keywords: article.keywords || [],
            },
          });
        } catch (err) {
          logger.error(`Erreur article ${article.numero}:`, err);
          result.errors++;
        }
      }

      if (vectors.length > 0) {
        await upsertArticleVectors(vectors);
      }

      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(articles.length / BATCH_SIZE);
      logger.info(`Batch ${batchNum}/${totalBatches} traité (${result.inserted} insérés, ${result.updated} mis à jour, ${result.errors} erreurs)`);
    } catch (err) {
      logger.error('Erreur batch embeddings:', err);
      result.errors += batch.length;
    }
  }

  logger.info(`Ingestion terminée: ${result.inserted} insérés, ${result.updated} mis à jour, ${result.errors} erreurs`);
  return result;
}

export default { ingestArticles, ingestFromSource };
