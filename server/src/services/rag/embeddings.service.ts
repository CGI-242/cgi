// server/src/services/rag/embeddings.service.ts
// Voyage AI voyage-multilingual-2 (1024 dims) - optimisé français
// Adapté de cgi-engine (remplace OpenAI text-embedding-3-small)

import { createLogger } from '../../utils/logger';
import { cacheService, CACHE_TTL, CACHE_PREFIX, hashText } from '../../utils/cache';

const logger = createLogger('EmbeddingsService');

// Voyage AI SDK
let voyageClient: any = null;

async function getVoyageClient() {
  if (!voyageClient) {
    const { VoyageAIClient } = await import('voyageai');
    voyageClient = new VoyageAIClient({
      apiKey: process.env.VOYAGE_API_KEY,
    });
  }
  return voyageClient;
}

const VOYAGE_MODEL = 'voyage-multilingual-2';
export const VECTOR_SIZE = 1024;

export interface EmbeddingResult {
  embedding: number[];
  tokensUsed: number;
  cached?: boolean;
}

/**
 * Génère un embedding pour un texte donné (avec cache in-memory)
 */
export async function generateEmbedding(text: string): Promise<EmbeddingResult> {
  const cacheKey = `${CACHE_PREFIX.EMBEDDING}${hashText(text)}`;

  const cached = cacheService.get<number[]>(cacheKey);
  if (cached) {
    logger.debug(`Embedding cache HIT for text hash: ${hashText(text)}`);
    return {
      embedding: cached,
      tokensUsed: 0,
      cached: true,
    };
  }

  const client = await getVoyageClient();
  const response = await client.embed({
    input: [text],
    model: VOYAGE_MODEL,
  });

  const embedding = response.data[0].embedding;
  const tokensUsed = response.usage?.totalTokens || 0;

  // Stocker dans le cache (7 jours)
  cacheService.set(cacheKey, embedding, CACHE_TTL.EMBEDDING);
  logger.debug(`Embedding cache MISS - stored for text hash: ${hashText(text)}`);

  return {
    embedding,
    tokensUsed,
    cached: false,
  };
}

/**
 * Génère des embeddings pour plusieurs textes
 */
export async function generateEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
  const BATCH_SIZE = 100;
  const results: EmbeddingResult[] = [];

  const client = await getVoyageClient();

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);

    const response = await client.embed({
      input: batch,
      model: VOYAGE_MODEL,
    });

    const tokensPerItem = Math.floor((response.usage?.totalTokens || 0) / batch.length);

    for (const data of response.data) {
      results.push({
        embedding: data.embedding,
        tokensUsed: tokensPerItem,
      });
    }

    logger.info(`Embeddings batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(texts.length / BATCH_SIZE)}`);
  }

  return results;
}

/**
 * Calcule la similarité cosinus entre deux vecteurs
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Les vecteurs doivent avoir la même dimension');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export default {
  generateEmbedding,
  generateEmbeddings,
  cosineSimilarity,
};
