// server/src/config/keyword-mappings-pv.ts
// Mappings mots-clés → articles pour Chapitre 7 - Plus-values titres, BTP, Réassurance (CGI 2025)

/**
 * Map de mots-clés vers les articles pertinents du chapitre 7
 * Structure: mot-clé/expression → liste d'articles avec poids
 */
export const KEYWORD_ARTICLE_MAP_PV: Record<string, Array<{ article: string; weight: number }>> = {
  // ==================== PLUS-VALUES SUR TITRES (Art. 185 quater) ====================

  // Art. 185 quater-A - Champ d'application
  'plus-values': [
    { article: 'Art. 185 quater-A', weight: 1.0 },
    { article: 'Art. 185 quater-B', weight: 0.9 },
  ],
  'plus-value': [
    { article: 'Art. 185 quater-A', weight: 1.0 },
    { article: 'Art. 185 quater-B', weight: 0.9 },
  ],
  'plus values': [
    { article: 'Art. 185 quater-A', weight: 1.0 },
    { article: 'Art. 185 quater-B', weight: 0.9 },
  ],
  'gains capital': [
    { article: 'Art. 185 quater-A', weight: 0.9 },
  ],
  'gains en capital': [
    { article: 'Art. 185 quater-A', weight: 0.9 },
  ],
  'cession titres': [
    { article: 'Art. 185 quater-A', weight: 1.0 },
    { article: 'Art. 185 quater-B', weight: 0.8 },
  ],
  'cession participations': [
    { article: 'Art. 185 quater-A', weight: 1.0 },
  ],
  'vente actions': [
    { article: 'Art. 185 quater-A', weight: 0.9 },
  ],
  'vente titres': [
    { article: 'Art. 185 quater-A', weight: 0.9 },
  ],
  'participations': [
    { article: 'Art. 185 quater-A', weight: 0.8 },
  ],
  'sociétés congolaises': [
    { article: 'Art. 185 quater-A', weight: 0.8 },
    { article: 'Art. 185 quater-C', weight: 0.7 },
  ],
  'société droit congolais': [
    { article: 'Art. 185 quater-A', weight: 0.9 },
    { article: 'Art. 185 quater-C', weight: 0.8 },
  ],
  'domiciliés étranger': [
    { article: 'Art. 185 quater-A', weight: 0.9 },
  ],
  'impôt spécial': [
    { article: 'Art. 185 quater-A', weight: 0.9 },
    { article: 'Art. 185 quater-B', weight: 0.9 },
  ],

  // Art. 185 quater-B - Taux et paiement
  '20% plus-values': [
    { article: 'Art. 185 quater-B', weight: 1.0 },
  ],
  'taux 20%': [
    { article: 'Art. 185 quater-B', weight: 0.9 },
    { article: 'Art. 185 sexies', weight: 0.7 },
  ],
  'libératoire': [
    { article: 'Art. 185 quater-B', weight: 1.0 },
  ],
  'enregistrement cession': [
    { article: 'Art. 185 quater-B', weight: 1.0 },
  ],
  'droits enregistrement': [
    { article: 'Art. 185 quater-B', weight: 0.9 },
  ],
  'acte cession': [
    { article: 'Art. 185 quater-B', weight: 0.9 },
  ],

  // Art. 185 quater-C - Solidarité
  'solidarité paiement': [
    { article: 'Art. 185 quater-C', weight: 1.0 },
  ],
  'solidairement responsables': [
    { article: 'Art. 185 quater-C', weight: 1.0 },
  ],
  'cédant': [
    { article: 'Art. 185 quater-C', weight: 0.9 },
  ],
  'cessionnaire': [
    { article: 'Art. 185 quater-C', weight: 0.9 },
  ],
  'responsables solidaires': [
    { article: 'Art. 185 quater-C', weight: 1.0 },
  ],

  // ==================== BTP - SOUS-TRAITANTS (Art. 185 quinquies) ====================

  'btp': [
    { article: 'Art. 185 quinquies', weight: 1.0 },
  ],
  'batiments travaux publics': [
    { article: 'Art. 185 quinquies', weight: 1.0 },
  ],
  'bâtiments travaux publics': [
    { article: 'Art. 185 quinquies', weight: 1.0 },
  ],
  'construction': [
    { article: 'Art. 185 quinquies', weight: 0.9 },
  ],
  'travaux publics': [
    { article: 'Art. 185 quinquies', weight: 0.9 },
  ],
  'sous-traitants': [
    { article: 'Art. 185 quinquies', weight: 1.0 },
  ],
  'sous-traitant': [
    { article: 'Art. 185 quinquies', weight: 1.0 },
  ],
  'sous-traitance': [
    { article: 'Art. 185 quinquies', weight: 0.9 },
  ],
  'bureaux études': [
    { article: 'Art. 185 quinquies', weight: 1.0 },
  ],
  "bureaux d'études": [
    { article: 'Art. 185 quinquies', weight: 1.0 },
  ],
  'entrepreneur principal': [
    { article: 'Art. 185 quinquies', weight: 1.0 },
  ],
  'adjudicataires': [
    { article: 'Art. 185 quinquies', weight: 0.9 },
  ],
  'marchés publics': [
    { article: 'Art. 185 quinquies', weight: 0.9 },
  ],
  'marchés privés': [
    { article: 'Art. 185 quinquies', weight: 0.9 },
  ],
  'marchés construction': [
    { article: 'Art. 185 quinquies', weight: 0.9 },
  ],
  '3%': [
    { article: 'Art. 185 quinquies', weight: 0.9 },
  ],
  'trois pourcent': [
    { article: 'Art. 185 quinquies', weight: 0.9 },
  ],
  '10% btp': [
    { article: 'Art. 185 quinquies', weight: 1.0 },
  ],
  'régime réel': [
    { article: 'Art. 185 quinquies', weight: 0.8 },
  ],
  'régime forfait': [
    { article: 'Art. 185 quinquies', weight: 0.8 },
  ],
  'retenue btp': [
    { article: 'Art. 185 quinquies', weight: 1.0 },
  ],
  'retenue sous-traitants': [
    { article: 'Art. 185 quinquies', weight: 1.0 },
  ],
  'acompte impôt': [
    { article: 'Art. 185 quinquies', weight: 0.9 },
  ],
  'déclaration trimestrielle': [
    { article: 'Art. 185 quinquies', weight: 0.9 },
  ],
  'liste sous-traitants': [
    { article: 'Art. 185 quinquies', weight: 1.0 },
  ],
  'bordereau spécial': [
    { article: 'Art. 185 quinquies', weight: 0.9 },
  ],
  'enregistrement marché': [
    { article: 'Art. 185 quinquies', weight: 0.9 },
  ],
  'enregistrement contrat': [
    { article: 'Art. 185 quinquies', weight: 0.9 },
  ],
  '5000000': [
    { article: 'Art. 185 quinquies', weight: 0.9 },
  ],
  '5 000 000': [
    { article: 'Art. 185 quinquies', weight: 0.9 },
  ],
  'amende btp': [
    { article: 'Art. 185 quinquies', weight: 1.0 },
  ],
  'perte déductibilité': [
    { article: 'Art. 185 quinquies', weight: 0.9 },
  ],
  '2% mois': [
    { article: 'Art. 185 quinquies', weight: 0.9 },
  ],
  'pénalité retard': [
    { article: 'Art. 185 quinquies', weight: 0.9 },
  ],

  // ==================== RÉASSURANCE (Art. 185 sexies) ====================

  'réassurance': [
    { article: 'Art. 185 sexies', weight: 1.0 },
  ],
  'reassurance': [
    { article: 'Art. 185 sexies', weight: 1.0 },
  ],
  'primes cédées': [
    { article: 'Art. 185 sexies', weight: 1.0 },
  ],
  'primes réassurance': [
    { article: 'Art. 185 sexies', weight: 1.0 },
  ],
  'cima': [
    { article: 'Art. 185 sexies', weight: 1.0 },
  ],
  'code cima': [
    { article: 'Art. 185 sexies', weight: 1.0 },
  ],
  'art. 308 cima': [
    { article: 'Art. 185 sexies', weight: 1.0 },
  ],
  'article 308': [
    { article: 'Art. 185 sexies', weight: 0.9 },
  ],
  'hors cima': [
    { article: 'Art. 185 sexies', weight: 1.0 },
  ],
  'assurance étranger': [
    { article: 'Art. 185 sexies', weight: 0.9 },
  ],
  'plafond réassurance': [
    { article: 'Art. 185 sexies', weight: 0.9 },
  ],
  '20% réassurance': [
    { article: 'Art. 185 sexies', weight: 1.0 },
  ],
  'retenue réassurance': [
    { article: 'Art. 185 sexies', weight: 1.0 },
  ],
  'autorisation ministre': [
    { article: 'Art. 185 sexies', weight: 0.8 },
  ],
  'ministre assurances': [
    { article: 'Art. 185 sexies', weight: 0.8 },
  ],
};

/**
 * Synonymes fiscaux pour l'expansion des requêtes
 */
export const SYNONYMS_PV: Record<string, string[]> = {
  'plus-values': ['gains en capital', 'cession participations', 'vente actions', 'vente titres'],
  'non-résidents': ['domiciliés à l\'étranger', 'étrangers', 'personnes domiciliées étranger'],
  'btp': ['bâtiments travaux publics', 'construction', 'travaux publics'],
  'sous-traitants': ['sous-traitance', 'bureaux d\'études'],
  'réassurance': ['primes cédées', 'assurance'],
  'cima': ['conférence interafricaine marchés assurances'],
};

/**
 * Trouve les articles pertinents pour une requête PV
 */
export function findArticlesForQueryPV(query: string): string[] {
  const normalizedQuery = query.toLowerCase();
  const articlesFound = new Map<string, number>();

  // Recherche directe dans les mots-clés
  for (const [keyword, articles] of Object.entries(KEYWORD_ARTICLE_MAP_PV)) {
    if (normalizedQuery.includes(keyword.toLowerCase())) {
      for (const { article, weight } of articles) {
        const current = articlesFound.get(article) || 0;
        articlesFound.set(article, Math.max(current, weight));
      }
    }
  }

  // Expansion par synonymes
  for (const [term, synonyms] of Object.entries(SYNONYMS_PV)) {
    if (normalizedQuery.includes(term) || synonyms.some(s => normalizedQuery.includes(s.toLowerCase()))) {
      const articles = KEYWORD_ARTICLE_MAP_PV[term];
      if (articles) {
        for (const { article, weight } of articles) {
          const current = articlesFound.get(article) || 0;
          articlesFound.set(article, Math.max(current, weight * 0.9));
        }
      }
    }
  }

  // Tri par poids décroissant et retour
  return [...articlesFound.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([article]) => article);
}
