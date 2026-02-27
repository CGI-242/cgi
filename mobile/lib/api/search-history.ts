// mobile/lib/api/search-history.ts
// Client API historique de recherche

import { api } from "./client";

export interface SearchHistoryItem {
  id: string;
  query: string;
  createdAt: string;
  article?: {
    id: string;
    numero: string;
    titre: string;
  } | null;
}

export interface PopularSearch {
  query: string;
  count: number;
}

/**
 * Récupérer les dernières recherches de l'utilisateur
 */
export async function getSearchHistory(
  page = 1,
  limit = 20
): Promise<{ searches: SearchHistoryItem[]; total: number }> {
  const { data } = await api.get<{ searches: SearchHistoryItem[]; total: number }>(
    `/search-history?page=${page}&limit=${limit}`
  );
  return data;
}

/**
 * Top 10 termes les plus recherchés
 */
export async function getPopularSearches(): Promise<PopularSearch[]> {
  const { data } = await api.get<{ popular: PopularSearch[] }>("/search-history/popular");
  return data.popular;
}

/**
 * Purger l'historique de recherche (RGPD)
 */
export async function clearSearchHistory(): Promise<void> {
  await api.delete("/search-history");
}
