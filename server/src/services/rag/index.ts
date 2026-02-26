// server/src/services/rag/index.ts

export * from './embeddings.service';
export { initializeCollection, upsertArticleVector, upsertArticleVectors, searchSimilarArticles, clearCollection, getQdrantClient } from './qdrant.service';
export type { ArticleVector } from './qdrant.service';
export { hybridSearch, CGI_COLLECTION, CGI_COLLECTIONS } from './hybrid-search.service';
export type { SearchResult, ArticlePayload, CGIVersion } from './hybrid-search.service';
export * from './chat.utils';
export * from './ingestion.service';
