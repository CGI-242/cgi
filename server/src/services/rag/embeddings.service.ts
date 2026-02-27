// server/src/services/rag/embeddings.service.ts
// Voyage AI voyage-multilingual-2 (1024 dims) - optimisé français
// Appel direct à l'API REST Voyage AI (sans SDK — élimine la dépendance vulnérable qs)

import { createLogger } from '../../utils/logger';
import { cacheService, CACHE_TTL, CACHE_PREFIX, hashText } from '../../utils/cache';

const logger = createLogger('EmbeddingsService');

const VOYAGE_API_URL = 'https://api.voyageai.com/v1/embeddings';
const VOYAGE_MODEL = 'voyage-multilingual-2';
export const VECTOR_SIZE = 1024;

interface VoyageEmbeddingResponse {
  object: string;
  data: { object: string; embedding: number[]; index: number }[];
  model: string;
  usage: { total_tokens: number };
}

/**
 * Appelle l'API Voyage AI pour générer des embeddings
 */
async function callVoyageApi(input: string[]): Promise<VoyageEmbeddingResponse> {
  const apiKey = process.env.VOYAGE_API_KEY;
  if (!apiKey) {
    throw new Error('VOYAGE_API_KEY non configurée');
  }

  const response = await fetch(VOYAGE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input, model: VOYAGE_MODEL }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Voyage AI API error ${response.status}: ${errorBody}`);
  }

  return response.json() as Promise<VoyageEmbeddingResponse>;
}

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

  const response = await callVoyageApi([text]);

  const embedding = response.data[0].embedding;
  const tokensUsed = response.usage?.total_tokens || 0;

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

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);

    const response = await callVoyageApi(batch);

    const tokensPerItem = Math.floor((response.usage?.total_tokens || 0) / batch.length);

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
