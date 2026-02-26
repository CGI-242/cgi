/**
 * Metadata des articles du CGI 2025 - Chapitre 4
 * Dispositions Communes (Art. 127 a 140 bis)
 *
 * @author NORMX AI - CGI 242
 * @version 2025
 */

export interface ArticleMetadataDC {
  numero: string;
  titre?: string;
  section: string;
  themes: string[];
  priority: number;
  defines?: string[];
  keywords?: string[];
  valeurs?: string[];
  statut?: 'en_vigueur' | 'abroge';
}

export const ARTICLE_METADATA_DC: Record<string, ArticleMetadataDC> = {
  // ========== SECTION 1 - REVISION DES BILANS ==========
  'Art. 127': {
    numero: 'Art. 127',
    titre: 'Revision des bilans',
    section: 'Revision des bilans',
    themes: ['reevaluation', 'plus-values', 'bilans'],
    priority: 1,
    defines: ['plus-values reevaluation'],
    valeurs: ['31 decembre 1964'],
    statut: 'en_vigueur',
  },

  'Art. 127 bis': {
    numero: 'Art. 127 bis',
    titre: 'Article abroge',
    section: 'Revision des bilans',
    themes: ['abroge'],
    priority: 5,
    statut: 'abroge',
  },

  'Art. 127 quater': {
    numero: 'Art. 127 quater',
    titre: 'Article abroge',
    section: 'Revision des bilans',
    themes: ['abroge'],
    priority: 5,
    statut: 'abroge',
  },

  'Art. 127 quinquies': {
    numero: 'Art. 127 quinquies',
    titre: 'Exclusion des regimes derogatoires multiples',
    section: 'Revision des bilans',
    themes: ['regimes derogatoires', 'CPP', 'convention etablissement', 'non-cumul'],
    priority: 1,
    defines: ['exclusion regimes multiples'],
    valeurs: ['1er janvier 2021'],
    statut: 'en_vigueur',
  },

  // ========== SECTION 2 - REDUCTIONS INVESTISSEMENT (ABROGEE) ==========
  'Art. 128': {
    numero: 'Art. 128',
    titre: 'Article abroge',
    section: 'Reductions investissement',
    themes: ['abroge', 'investissement'],
    priority: 5,
    statut: 'abroge',
  },

  'Art. 129': {
    numero: 'Art. 129',
    titre: 'Article abroge',
    section: 'Reductions investissement',
    themes: ['abroge', 'investissement'],
    priority: 5,
    statut: 'abroge',
  },

  'Art. 130': {
    numero: 'Art. 130',
    titre: 'Article abroge',
    section: 'Reductions investissement',
    themes: ['abroge', 'investissement'],
    priority: 5,
    statut: 'abroge',
  },

  'Art. 131': {
    numero: 'Art. 131',
    titre: 'Article abroge',
    section: 'Reductions investissement',
    themes: ['abroge', 'investissement'],
    priority: 5,
    statut: 'abroge',
  },

  'Art. 132': {
    numero: 'Art. 132',
    titre: 'Article abroge',
    section: 'Reductions investissement',
    themes: ['abroge', 'investissement'],
    priority: 5,
    statut: 'abroge',
  },

  // ========== SECTION 3 - REGIME SPECIAL EXPLOITATIONS MINIERES ==========
  // Sous-section 1 - Hydrocarbures
  'Art. 133': {
    numero: 'Art. 133',
    titre: 'Provision pour reconstitution des gisements - Principe',
    section: 'Hydrocarbures',
    themes: ['provision reconstitution gisements', 'PRG', 'franchise impot'],
    priority: 1,
    defines: ['provision reconstitution gisements'],
    statut: 'en_vigueur',
  },

  'Art. 134': {
    numero: 'Art. 134',
    titre: 'Limites de la provision hydrocarbures',
    section: 'Hydrocarbures',
    themes: ['provision', 'limites', 'taux', 'ventes', 'benefice net'],
    priority: 1,
    defines: ['limites provision hydrocarbures'],
    valeurs: ['27,50%', '50%', '5 exercices'],
    keywords: ['petrole', 'gaz naturel', 'deficit', 'report'],
    statut: 'en_vigueur',
  },

  'Art. 135': {
    numero: 'Art. 135',
    titre: 'Inscription au bilan',
    section: 'Hydrocarbures',
    themes: ['bilan', 'passif', 'comptabilite'],
    priority: 2,
    defines: ['inscription provision bilan'],
    statut: 'en_vigueur',
  },

  'Art. 136': {
    numero: 'Art. 136',
    titre: 'Utilisation de la provision hydrocarbures',
    section: 'Hydrocarbures',
    themes: ['utilisation provision', 'emplois autorises', 'recherche', 'participations'],
    priority: 1,
    defines: ['emplois autorises provision'],
    valeurs: ['5 ans'],
    keywords: ['travaux recherche', 'immobilisations', 'gisement reconnu'],
    statut: 'en_vigueur',
  },

  'Art. 137': {
    numero: 'Art. 137',
    titre: 'Remploi et sanctions',
    section: 'Hydrocarbures',
    themes: ['remploi', 'exoneration', 'sanctions', 'imposition complementaire'],
    priority: 1,
    defines: ['remploi conforme', 'defaut remploi'],
    keywords: ['exoneration definitive', 'virement reserve'],
    statut: 'en_vigueur',
  },

  'Art. 138': {
    numero: 'Art. 138',
    titre: 'Cession, cessation et deces',
    section: 'Hydrocarbures',
    themes: ['cession', 'cessation', 'deces', 'fusion', 'continuation'],
    priority: 1,
    defines: ['sort provision cession'],
    keywords: ['heritiers', 'societe absorbante', 'continuation exploitation'],
    statut: 'en_vigueur',
  },

  'Art. 139': {
    numero: 'Art. 139',
    titre: 'Obligations declaratives',
    section: 'Hydrocarbures',
    themes: ['obligations declaratives', 'renseignements', 'declaration'],
    priority: 2,
    defines: ['obligations declaratives hydrocarbures'],
    statut: 'en_vigueur',
  },

  // Sous-section 2 - Substances minerales
  'Art. 140': {
    numero: 'Art. 140',
    titre: 'Provision substances minerales',
    section: 'Substances minerales',
    themes: ['provision', 'minerais', 'substances minerales', 'mines'],
    priority: 1,
    defines: ['provision substances minerales'],
    valeurs: ['15%', '50%'],
    keywords: ['mattes', 'speiss', 'metaux', 'alliages', 'gisements existants'],
    statut: 'en_vigueur',
  },

  'Art. 140 bis': {
    numero: 'Art. 140 bis',
    titre: 'Non-cumul avec reductions investissement',
    section: 'Substances minerales',
    themes: ['non-cumul', 'reductions investissement'],
    priority: 1,
    defines: ['non-cumul provisions'],
    statut: 'en_vigueur',
  },
};

/**
 * Articles prioritaires par theme
 */
export const PRIORITY_ARTICLES_DC: Record<string, string[]> = {
  'hydrocarbures': ['Art. 134', 'Art. 136', 'Art. 137', 'Art. 133'],
  'substances_minerales': ['Art. 140', 'Art. 140 bis'],
  'provisions': ['Art. 133', 'Art. 134', 'Art. 140'],
  'utilisation': ['Art. 136', 'Art. 140'],
  'sanctions': ['Art. 137'],
  'cession': ['Art. 138'],
  'regimes_derogatoires': ['Art. 127 quinquies'],
  'reevaluation': ['Art. 127'],
};
