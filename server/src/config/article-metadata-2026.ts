/**
 * Metadata des articles du CGI 2026 - Chapitre IS
 * Utilisé pour le scoring et le reranking dans la recherche hybride
 *
 * @author NORMX AI - CGI 242
 * @version 2026
 */

export interface ArticleMetadata2026 {
  numero: string;
  titre?: string;
  section: string;
  themes: string[];
  priority: number; // 1 = très important, 5 = moins important
  defines?: string[]; // Concepts définis par cet article
  keywords?: string[];
  valeurs?: string[]; // Taux, seuils, délais
}

export const ARTICLE_METADATA_2026: Record<string, ArticleMetadata2026> = {
  // ========== SECTION 1 - GENERALITES ==========
  'Art. 1er': {
    numero: 'Art. 1er',
    titre: 'Principe de l\'IS',
    section: 'Généralités',
    themes: ['principe IS', 'définition IS'],
    priority: 1,
    defines: ['impôt sur les sociétés'],
  },

  // ========== SECTION 2 - CHAMP D'APPLICATION ==========
  'Art. 2': {
    numero: 'Art. 2',
    titre: 'Personnes imposables',
    section: 'Champ d\'application',
    themes: ['personnes imposables', 'sociétés de capitaux', 'option IS'],
    priority: 1,
    defines: ['personnes imposables IS', 'option IS'],
    keywords: ['SA', 'SAS', 'SARL', 'SNC', '30 octobre'],
  },

  'Art. 3': {
    numero: 'Art. 3',
    titre: 'Exonérations',
    section: 'Champ d\'application',
    themes: ['exonérations', 'coopératives'],
    priority: 1,
    defines: ['exonérations IS'],
    keywords: ['coopératives agricoles', 'exonérations conventionnelles', '2026'],
  },

  'Art. 3A': {
    numero: 'Art. 3A',
    titre: 'Crédit d\'impôt investissement',
    section: 'Champ d\'application',
    themes: ['crédit d\'impôt', 'investissement'],
    priority: 2,
    defines: ['crédit d\'impôt investissement'],
    valeurs: ['15%', '5 ans report'],
  },

  'Art. 4': {
    numero: 'Art. 4',
    titre: 'Territorialité',
    section: 'Champ d\'application',
    themes: ['territorialité'],
    priority: 2,
  },

  'Art. 4A': {
    numero: 'Art. 4A',
    titre: 'Établissement stable',
    section: 'Champ d\'application',
    themes: ['établissement stable', 'installation fixe'],
    priority: 1,
    defines: ['établissement stable'],
    valeurs: ['3 mois', '183 jours'],
    keywords: ['chantier', 'services', 'succursale'],
  },

  'Art. 7': {
    numero: 'Art. 7',
    titre: 'Résidence fiscale',
    section: 'Champ d\'application',
    themes: ['résidence fiscale'],
    priority: 2,
  },

  // ========== SECTION 3 - BENEFICE IMPOSABLE ==========
  'Art. 8': {
    numero: 'Art. 8',
    titre: 'Définition du bénéfice net',
    section: 'Bénéfice imposable',
    themes: ['bénéfice net', 'bénéfice imposable'],
    priority: 1,
    defines: ['bénéfice net imposable'],
  },

  'Art. 26': {
    numero: 'Art. 26',
    titre: 'Conditions de déductibilité',
    section: 'Charges déductibles',
    themes: ['conditions déductibilité', 'charges déductibles'],
    priority: 1,
    defines: ['conditions de déductibilité'],
    valeurs: ['200 000 FCFA'],
    keywords: ['acte anormal de gestion', 'paiement espèces'],
  },

  // ========== CHARGES FINANCIERES ==========
  'Art. 49': {
    numero: 'Art. 49',
    titre: 'Charges financières',
    section: 'Charges déductibles',
    themes: ['charges financières', 'intérêts', 'sous-capitalisation'],
    priority: 1,
    defines: ['limitation des intérêts'],
    valeurs: ['20% EBE', 'taux BEAC'],
    keywords: ['sous-capitalisation', 'intérêts déductibles'],
  },

  // ========== AMORTISSEMENTS ==========
  'Art. 51': {
    numero: 'Art. 51',
    titre: 'Amortissements - Principe',
    section: 'Amortissements',
    themes: ['amortissements'],
    priority: 1,
    defines: ['amortissements déductibles'],
  },

  'Art. 52': {
    numero: 'Art. 52',
    titre: 'Taux d\'amortissement',
    section: 'Amortissements',
    themes: ['taux amortissement'],
    priority: 2,
    defines: ['taux d\'amortissement'],
  },

  'Art. 57': {
    numero: 'Art. 57',
    titre: 'Amortissement accéléré',
    section: 'Amortissements',
    themes: ['amortissement accéléré'],
    priority: 2,
    valeurs: ['40 000 000 FCFA'],
  },

  'Art. 58': {
    numero: 'Art. 58',
    titre: 'Véhicules de tourisme',
    section: 'Amortissements',
    themes: ['véhicules tourisme', 'plafond amortissement'],
    priority: 2,
    valeurs: ['40 000 000 FCFA'],
  },

  // ========== REPORT DEFICITS ==========
  'Art. 75': {
    numero: 'Art. 75',
    titre: 'Report des déficits',
    section: 'Charges déductibles',
    themes: ['report déficits', 'déficits reportables'],
    priority: 1,
    defines: ['report déficitaire'],
    valeurs: ['5 ans'],
  },

  // ========== PRIX DE TRANSFERT ==========
  'Art. 77': {
    numero: 'Art. 77',
    titre: 'Prix de transfert - Principe',
    section: 'Prix de transfert',
    themes: ['prix de transfert', 'parties liées'],
    priority: 1,
    defines: ['prix de transfert', 'entreprises liées'],
  },

  'Art. 78': {
    numero: 'Art. 78',
    titre: 'Documentation prix de transfert',
    section: 'Prix de transfert',
    themes: ['documentation', 'obligations déclaratives'],
    priority: 2,
    valeurs: ['500 000 000 FCFA'],
  },

  'Art. 79': {
    numero: 'Art. 79',
    titre: 'Méthodes de prix de transfert',
    section: 'Prix de transfert',
    themes: ['méthodes', 'CUP', 'MTMN'],
    priority: 2,
    defines: ['méthodes prix de transfert'],
  },

  'Art. 80': {
    numero: 'Art. 80',
    titre: 'APP - Accord préalable de prix',
    section: 'Prix de transfert',
    themes: ['APP', 'accord préalable'],
    priority: 2,
    defines: ['accord préalable de prix'],
    valeurs: ['3 ans'],
  },

  'Art. 81': {
    numero: 'Art. 81',
    titre: 'Sanctions prix de transfert',
    section: 'Prix de transfert',
    themes: ['sanctions', 'amendes'],
    priority: 2,
    valeurs: ['5 000 000 FCFA', '25 000 000 FCFA'],
  },

  // ========== SECTION 4 - TAUX ET ASSIETTE ==========
  'Art. 86': {
    numero: 'Art. 86',
    titre: 'Assiette de l\'IS',
    section: 'Modalités d\'imposition',
    themes: ['assiette IS'],
    priority: 1,
  },

  'Art. 86A': {
    numero: 'Art. 86A',
    titre: 'Taux de l\'IS',
    section: 'Modalités d\'imposition',
    themes: ['taux IS', '25%', '33%'],
    priority: 1,
    defines: ['taux IS'],
    valeurs: ['25%', '33%'],
    keywords: ['taux normal', 'non-résidents CEMAC'],
  },

  'Art. 86B': {
    numero: 'Art. 86B',
    titre: 'Minimum de perception',
    section: 'Modalités d\'imposition',
    themes: ['minimum perception', 'impôt minimum'],
    priority: 1,
    defines: ['minimum de perception IS'],
    valeurs: ['1%', '2%', '15 mars', '15 juin', '15 septembre', '15 décembre'],
    keywords: ['déficit consécutif', 'acomptes'],
  },

  'Art. 86C': {
    numero: 'Art. 86C',
    titre: 'Retenue à la source',
    section: 'Modalités d\'imposition',
    themes: ['retenue à la source', 'prestations non-résidents'],
    priority: 1,
    defines: ['retenue à la source IS'],
    valeurs: ['20%'],
    keywords: ['prestations', 'redevances', 'non-résidents'],
  },

  // ========== REGIMES PARTICULIERS ==========
  'Art. 87': {
    numero: 'Art. 87',
    titre: 'Régime mère-fille',
    section: 'Régimes particuliers',
    themes: ['sociétés mères', 'filiales', 'dividendes'],
    priority: 1,
    defines: ['régime mère-fille'],
    valeurs: ['25%', '2 ans'],
  },

  'Art. 87A': {
    numero: 'Art. 87A',
    titre: 'Quote-part frais et charges',
    section: 'Régimes particuliers',
    themes: ['quote-part', 'frais mère-fille'],
    priority: 2,
    valeurs: ['10%'],
  },

  'Art. 89': {
    numero: 'Art. 89',
    titre: 'Quartiers généraux',
    section: 'Régimes particuliers',
    themes: ['quartiers généraux', 'CEMAC'],
    priority: 2,
    defines: ['quartiers généraux'],
  },

  'Art. 90': {
    numero: 'Art. 90',
    titre: 'Holdings',
    section: 'Régimes particuliers',
    themes: ['holdings', 'société de participation'],
    priority: 1,
    defines: ['régime des holdings'],
    valeurs: ['deux tiers actif'],
  },

  'Art. 91': {
    numero: 'Art. 91',
    titre: 'Intégration fiscale',
    section: 'Régimes particuliers',
    themes: ['intégration fiscale', 'groupe fiscal'],
    priority: 1,
    defines: ['intégration fiscale'],
    valeurs: ['95%', '5 exercices'],
  },

  'Art. 92': {
    numero: 'Art. 92',
    titre: 'Personnes morales étrangères',
    section: 'Régimes particuliers',
    themes: ['personnes morales étrangères', 'non-résidents'],
    priority: 1,
    defines: ['régime personnes morales étrangères'],
    valeurs: ['22%'],
  },

  'Art. 92A': {
    numero: 'Art. 92A',
    titre: 'Sous-traitants pétroliers',
    section: 'Régimes particuliers',
    themes: ['sous-traitants pétroliers', 'secteur pétrolier'],
    priority: 2,
  },

  'Art. 92E': {
    numero: 'Art. 92E',
    titre: 'Quitus fiscal',
    section: 'Régimes particuliers',
    themes: ['quitus fiscal'],
    priority: 2,
    defines: ['quitus fiscal'],
  },

  'Art. 92J': {
    numero: 'Art. 92J',
    titre: 'Zone Angola',
    section: 'Régimes particuliers',
    themes: ['zone Angola', 'retenue spéciale'],
    priority: 3,
    valeurs: ['5,75%'],
  },

  // ========== OBLIGATIONS ==========
  'Art. 124': {
    numero: 'Art. 124',
    titre: 'Acomptes IS',
    section: 'Obligations',
    themes: ['acomptes IS', 'versement spontané'],
    priority: 1,
    defines: ['acomptes IS'],
    valeurs: ['15 février', '15 mai', '15 août', '15 novembre'],
  },
};

/**
 * Articles prioritaires par thème pour le reranking
 */
export const PRIORITY_ARTICLES_2026: Record<string, string[]> = {
  'taux': ['Art. 86A', 'Art. 86B', 'Art. 86C', 'Art. 52'],
  'exonérations': ['Art. 3', 'Art. 3A'],
  'établissement stable': ['Art. 4A', 'Art. 4'],
  'prix de transfert': ['Art. 77', 'Art. 78', 'Art. 79', 'Art. 80', 'Art. 81'],
  'amortissements': ['Art. 51', 'Art. 52', 'Art. 57', 'Art. 58'],
  'déficits': ['Art. 75'],
  'minimum perception': ['Art. 86B'],
  'retenue source': ['Art. 86C'],
  'mère-fille': ['Art. 87', 'Art. 87A'],
  'holding': ['Art. 90', 'Art. 90A'],
  'intégration fiscale': ['Art. 91', 'Art. 91A', 'Art. 91B'],
  'personnes morales étrangères': ['Art. 92', 'Art. 92A'],
  'acomptes': ['Art. 124', 'Art. 86B'],
};
