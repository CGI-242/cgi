// server/src/services/rag/hybrid-search.chapters.ts
// Fonctions de recherche par chapitre CGI avec factory pattern
// Copie de cgi-engine adaptée (sans .js)

import { findArticlesForQuery } from '../../config/keyword-mappings';
import { getArticleMetadata } from '../../config/article-metadata';
import { KEYWORD_ARTICLE_MAP_IS, SYNONYMS_IS } from '../../config/keyword-mappings-is';
import { ARTICLE_METADATA_IS, ArticleMetadataIS } from '../../config/article-metadata-is';
import { KEYWORD_ARTICLE_MAP_2026, SYNONYMS_2026 } from '../../config/keyword-mappings-2026';
import { ARTICLE_METADATA_2026, ArticleMetadata2026 } from '../../config/article-metadata-2026';
import { KEYWORD_ARTICLE_MAP_IBA_2026, SYNONYMS_IBA_2026 } from '../../config/keyword-mappings-iba-2026';
import { ARTICLE_METADATA_IBA_2026, ArticleMetadataIBA2026 } from '../../config/article-metadata-iba-2026';
import { KEYWORD_ARTICLE_MAP_DC, SYNONYMS_DC } from '../../config/keyword-mappings-dc';
import { ARTICLE_METADATA_DC, ArticleMetadataDC } from '../../config/article-metadata-dc';
import { KEYWORD_ARTICLE_MAP_TD, SYNONYMS_TD } from '../../config/keyword-mappings-td';
import { ARTICLE_METADATA_TD, ArticleMetadataTD } from '../../config/article-metadata-td';
import { KEYWORD_ARTICLE_MAP_DD, SYNONYMS_DD } from '../../config/keyword-mappings-dd';
import { ARTICLE_METADATA_DD, ArticleMetadataDD } from '../../config/article-metadata-dd';
import { KEYWORD_ARTICLE_MAP_PV, SYNONYMS_PV } from '../../config/keyword-mappings-pv';
import { ARTICLE_METADATA_PV, ArticleMetadataPV } from '../../config/article-metadata-pv';
import { KEYWORD_ARTICLE_MAP_IL, SYNONYMS_IL } from '../../config/keyword-mappings-il';
import { ARTICLE_METADATA_IL, ArticleMetadataIL } from '../../config/article-metadata-il';

type KeywordMap = Record<string, string[] | Array<{ article: string }>>;
type SynonymsMap = Record<string, string[]>;

/**
 * Factory générique pour créer des fonctions de recherche par chapitre
 */
function createChapterSearch(
  keywordMap: KeywordMap,
  synonymsMap: SynonymsMap,
  isArrayFormat: boolean = false
): (query: string) => string[] {
  return (query: string): string[] => {
    const normalizedQuery = query.toLowerCase();
    const matchedArticles: string[] = [];
    const seen = new Set<string>();

    // Expansion avec synonymes
    let expandedQuery = normalizedQuery;
    for (const [term, synonyms] of Object.entries(synonymsMap)) {
      for (const synonym of synonyms) {
        if (normalizedQuery.includes(synonym.toLowerCase())) {
          expandedQuery += ` ${term}`;
        }
      }
    }

    // Recherche dans le mapping
    for (const [keyword, articles] of Object.entries(keywordMap)) {
      if (expandedQuery.includes(keyword.toLowerCase())) {
        for (const articleEntry of articles) {
          const article = isArrayFormat && typeof articleEntry === 'object'
            ? (articleEntry as { article: string }).article
            : articleEntry as string;
          if (!seen.has(article)) {
            seen.add(article);
            matchedArticles.push(article);
          }
        }
      }
    }

    return matchedArticles;
  };
}

// Fonctions de recherche par chapitre
export const findArticlesForQuery2026 = createChapterSearch(KEYWORD_ARTICLE_MAP_2026, SYNONYMS_2026);
export const findArticlesForQueryIS = createChapterSearch(KEYWORD_ARTICLE_MAP_IS, SYNONYMS_IS);
export const findArticlesForQueryIBA2026 = createChapterSearch(KEYWORD_ARTICLE_MAP_IBA_2026, SYNONYMS_IBA_2026);
export const findArticlesForQueryDC = createChapterSearch(KEYWORD_ARTICLE_MAP_DC, SYNONYMS_DC);
export const findArticlesForQueryTD = createChapterSearch(KEYWORD_ARTICLE_MAP_TD, SYNONYMS_TD);
export const findArticlesForQueryDD = createChapterSearch(KEYWORD_ARTICLE_MAP_DD, SYNONYMS_DD, true);
export const findArticlesForQueryPV = createChapterSearch(KEYWORD_ARTICLE_MAP_PV, SYNONYMS_PV, true);
export const findArticlesForQueryIL = createChapterSearch(KEYWORD_ARTICLE_MAP_IL, SYNONYMS_IL, true);

// Ré-export de la fonction IRPP originale
export { findArticlesForQuery };

// Types de métadonnées exportés
export type AnyArticleMetadata =
  | ArticleMetadataIS
  | ArticleMetadata2026
  | ArticleMetadataIBA2026
  | ArticleMetadataDC
  | ArticleMetadataTD
  | ArticleMetadataDD
  | ArticleMetadataPV
  | ArticleMetadataIL;

/**
 * Normalise le numéro d'article
 */
function normalizeArticleNumber(numero: string): string {
  return numero.replace(/^Art\.\s*/i, 'Art. ');
}

/**
 * Obtient les métadonnées d'un article pour CGI 2026
 */
export function getArticleMetadata2026(numero: string): ArticleMetadata2026 | undefined {
  const normalized = normalizeArticleNumber(numero);
  return ARTICLE_METADATA_2026[normalized] || ARTICLE_METADATA_2026[numero];
}

/**
 * Obtient les métadonnées d'un article pour CGI 2025 IS
 */
export function getArticleMetadataIS(numero: string): ArticleMetadataIS | undefined {
  const normalized = normalizeArticleNumber(numero);
  return ARTICLE_METADATA_IS[normalized] || ARTICLE_METADATA_IS[numero];
}

/**
 * Obtient les métadonnées d'un article pour CGI 2026 IBA
 */
export function getArticleMetadataIBA2026(numero: string): ArticleMetadataIBA2026 | undefined {
  const normalized = normalizeArticleNumber(numero);
  return ARTICLE_METADATA_IBA_2026[normalized] || ARTICLE_METADATA_IBA_2026[numero];
}

/**
 * Obtient les métadonnées d'un article pour CGI 2025 DC
 */
export function getArticleMetadataDC(numero: string): ArticleMetadataDC | undefined {
  const normalized = normalizeArticleNumber(numero);
  return ARTICLE_METADATA_DC[normalized] || ARTICLE_METADATA_DC[numero];
}

/**
 * Obtient les métadonnées d'un article pour CGI 2025 TD
 */
export function getArticleMetadataTD(numero: string): ArticleMetadataTD | undefined {
  const normalized = normalizeArticleNumber(numero);
  return ARTICLE_METADATA_TD[normalized] || ARTICLE_METADATA_TD[numero];
}

/**
 * Obtient les métadonnées pour articles avec format tableau (DD, PV, IL)
 */
export function getArticleMetadataDD(numero: string): ArticleMetadataDD | undefined {
  const normalized = normalizeArticleNumber(numero);
  const numOnly = numero.replace(/^Art\.\s*/i, '');
  return ARTICLE_METADATA_DD.find(
    a => a.numero === normalized || a.numero === numero || a.numero === `Art. ${numOnly}`
  );
}

export function getArticleMetadataPV(numero: string): ArticleMetadataPV | undefined {
  const normalized = normalizeArticleNumber(numero);
  const numOnly = numero.replace(/^Art\.\s*/i, '');
  return ARTICLE_METADATA_PV.find(
    a => a.numero === normalized || a.numero === numero || a.numero === `Art. ${numOnly}`
  );
}

export function getArticleMetadataIL(numero: string): ArticleMetadataIL | undefined {
  const normalized = normalizeArticleNumber(numero);
  const numOnly = numero.replace(/^Art\.\s*/i, '');
  return ARTICLE_METADATA_IL.find(
    a => a.numero === normalized || a.numero === numero || a.numero === `Art. ${numOnly}`
  );
}

export interface MetadataResult {
  priority: number;
  articleType?: string;
}

/**
 * Récupère les métadonnées d'un article selon la version
 */
export function getMetadataForArticle(numero: string, version: '2025' | '2026' | 'current'): MetadataResult {
  const numWithPrefix = numero.startsWith('Art.') ? numero : `Art. ${numero}`;

  if (version === '2026' || version === 'current') {
    const metadataIS = getArticleMetadata2026(numWithPrefix) || getArticleMetadata2026(numero);
    const metadataIBA = getArticleMetadataIBA2026(numWithPrefix) || getArticleMetadataIBA2026(numero);
    const metadata = metadataIS || metadataIBA;
    return {
      priority: metadata?.priority || 2,
      articleType: metadata?.themes?.[0],
    };
  }

  // Version 2025
  const metadataIRPP = getArticleMetadata(numWithPrefix) || getArticleMetadata(numero);
  const metadataIS = getArticleMetadataIS(numWithPrefix) || getArticleMetadataIS(numero);
  const metadataDC = getArticleMetadataDC(numWithPrefix) || getArticleMetadataDC(numero);
  const metadataTD = getArticleMetadataTD(numWithPrefix) || getArticleMetadataTD(numero);
  const metadataDD = getArticleMetadataDD(numWithPrefix) || getArticleMetadataDD(numero);
  const metadataPV = getArticleMetadataPV(numWithPrefix) || getArticleMetadataPV(numero);
  const metadataIL = getArticleMetadataIL(numWithPrefix) || getArticleMetadataIL(numero);

  const metadata = metadataIRPP || metadataIS || metadataDC || metadataTD || metadataDD || metadataPV || metadataIL;

  return {
    priority: metadata?.priority || 2,
    articleType:
      metadataIRPP?.type ||
      metadataIS?.themes?.[0] ||
      metadataDC?.themes?.[0] ||
      metadataTD?.themes?.[0] ||
      metadataDD?.themes?.[0] ||
      metadataPV?.themes?.[0] ||
      metadataIL?.themes?.[0],
  };
}

/**
 * Extrait les articles correspondants via keyword matching
 */
export function extractKeywordMatches(query: string, version: '2025' | '2026' | 'current'): string[] {
  const seen = new Set<string>();
  const articles: string[] = [];

  const addUnique = (arts: string[]) => {
    for (const art of arts) {
      if (!seen.has(art)) {
        seen.add(art);
        articles.push(art);
      }
    }
  };

  if (version === '2026' || version === 'current') {
    addUnique(findArticlesForQuery2026(query));
    addUnique(findArticlesForQueryIBA2026(query));
  } else {
    addUnique(findArticlesForQuery(query));
    addUnique(findArticlesForQueryIS(query));
    addUnique(findArticlesForQueryDC(query));
    addUnique(findArticlesForQueryTD(query));
    addUnique(findArticlesForQueryDD(query));
    addUnique(findArticlesForQueryPV(query));
    addUnique(findArticlesForQueryIL(query));
  }

  return articles;
}

export default {
  findArticlesForQuery2026,
  findArticlesForQueryIS,
  findArticlesForQueryIBA2026,
  findArticlesForQueryDC,
  findArticlesForQueryTD,
  findArticlesForQueryDD,
  findArticlesForQueryPV,
  findArticlesForQueryIL,
  getMetadataForArticle,
  extractKeywordMatches,
};
