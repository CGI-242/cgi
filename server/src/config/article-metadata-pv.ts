// server/src/config/article-metadata-pv.ts
// Métadonnées des articles - Chapitre 7 Plus-values titres, BTP, Réassurance (CGI 2025)

export interface ArticleMetadataPV {
  numero: string;
  titre: string;
  section: string;
  themes: string[];
  mots_cles: string[];
  valeurs_cles?: Record<string, string | number>;
  references_croisees?: string[];
  priority: number; // 1-5, 5 étant le plus important
}

export const ARTICLE_METADATA_PV: ArticleMetadataPV[] = [
  // ==================== PLUS-VALUES SUR TITRES (Chapitre 7) ====================
  {
    numero: 'Art. 185 quater-A',
    titre: 'Champ d\'application - Plus-values sur titres non-résidents',
    section: 'Plus-values sur titres',
    themes: ['plus-values', 'cession titres', 'non-résidents'],
    mots_cles: ['plus-values', 'cession', 'titres', 'participations', 'non-résidents', 'sociétés congolaises', 'impôt spécial'],
    priority: 5,
  },
  {
    numero: 'Art. 185 quater-B',
    titre: 'Taux et paiement - Plus-values sur titres',
    section: 'Plus-values sur titres',
    themes: ['taux', 'plus-values', 'libératoire', 'enregistrement'],
    mots_cles: ['20%', 'libératoire', 'enregistrement', 'acte cession', 'droits enregistrement'],
    valeurs_cles: {
      taux: '20%',
      caractere: 'libératoire',
    },
    priority: 5,
  },
  {
    numero: 'Art. 185 quater-C',
    titre: 'Solidarité du paiement - Plus-values sur titres',
    section: 'Plus-values sur titres',
    themes: ['solidarité', 'responsabilité'],
    mots_cles: ['solidarité', 'cédant', 'cessionnaire', 'société congolaise', 'responsables solidaires'],
    priority: 4,
  },

  // ==================== BTP - SOUS-TRAITANTS (Section 8) ====================
  {
    numero: 'Art. 185 quinquies',
    titre: 'Retenue sur paiements aux sous-traitants BTP',
    section: 'Retenue BTP',
    themes: ['btp', 'sous-traitants', 'retenue source', 'acompte'],
    mots_cles: ['btp', 'sous-traitants', 'bureaux études', 'entrepreneur principal', 'marchés publics', 'marchés privés', '3%', '10%', 'régime réel', 'régime forfait', 'acompte', 'trimestriel', 'bordereau spécial', 'enregistrement', '5 000 000 FCFA', '2% mois'],
    valeurs_cles: {
      taux_reel: '3%',
      taux_forfait: '10%',
      amende_defaut: '5 000 000 FCFA',
      penalite_retard: '2% par mois (max 100%)',
    },
    references_croisees: ['Art. 172', 'Art. 173'],
    priority: 5,
  },

  // ==================== RÉASSURANCE (Section 9) ====================
  {
    numero: 'Art. 185 sexies',
    titre: 'Retenue sur primes de réassurance hors CIMA',
    section: 'Réassurance',
    themes: ['réassurance', 'primes', 'cima', 'retenue'],
    mots_cles: ['réassurance', 'primes cédées', 'cima', 'art. 308', 'hors cima', '20%', 'assurance étranger', 'autorisation ministre'],
    valeurs_cles: {
      taux: '20%',
      reference_cima: 'Art. 308 Code CIMA',
    },
    references_croisees: ['Art. 185 ter', 'Art. 308 Code CIMA'],
    priority: 4,
  },
];

/**
 * Articles prioritaires pour le chapitre 7
 */
export const PRIORITY_ARTICLES_PV = [
  'Art. 185 quater-A',  // Plus-values champ - fondamental
  'Art. 185 quater-B',  // Plus-values taux 20% - très demandé
  'Art. 185 quinquies', // BTP sous-traitants - très fréquent
];

/**
 * Récupère les métadonnées d'un article PV
 */
export function getArticleMetadataPV(numero: string): ArticleMetadataPV | undefined {
  const normalized = numero.replace(/^Art\.\s*/i, 'Art. ');
  return ARTICLE_METADATA_PV.find(
    a => a.numero === normalized || a.numero === numero || a.numero === `Art. ${normalized.replace('Art. ', '')}`
  );
}

/**
 * Récupère les articles par section
 */
export function getArticlesBySection(section: string): ArticleMetadataPV[] {
  return ARTICLE_METADATA_PV.filter(a => a.section === section);
}

/**
 * Récupère les articles par thème
 */
export function getArticlesByTheme(theme: string): ArticleMetadataPV[] {
  const themeLower = theme.toLowerCase();
  return ARTICLE_METADATA_PV.filter(
    a => a.themes.some(t => t.toLowerCase().includes(themeLower))
  );
}
