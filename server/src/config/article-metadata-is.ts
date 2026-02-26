/**
 * Metadata des articles du CGI 2025 - Chapitre 3 : IS
 * Utilise pour le scoring et le reranking dans la recherche hybride
 *
 * @author NORMX AI - CGI 242
 * @version 2025
 */

export interface ArticleMetadataIS {
  numero: string;
  titre?: string;
  section: string;
  themes: string[];
  priority: number; // 1 = tres important, 5 = moins important
  defines?: string[]; // Concepts definis par cet article
  keywords?: string[];
  valeurs?: string[]; // Taux, seuils, delais
}

export const ARTICLE_METADATA_IS: Record<string, ArticleMetadataIS> = {
  // ========== SECTION 1 - GENERALITES ==========
  'Art. 106': {
    numero: 'Art. 106',
    titre: 'Principe de l\'IS',
    section: 'Generalites',
    themes: ['principe IS', 'definition IS'],
    priority: 1,
    defines: ['impot sur les societes'],
  },

  // ========== SECTION 2 - CHAMP D'APPLICATION ==========
  'Art. 107': {
    numero: 'Art. 107',
    titre: 'Personnes imposables',
    section: 'Champ d\'application',
    themes: ['personnes imposables', 'societes de capitaux', 'option IS'],
    priority: 1,
    defines: ['personnes imposables IS', 'option IS'],
    keywords: ['SA', 'SARL', 'SNC'],
  },

  'Art. 107-A': {
    numero: 'Art. 107-A',
    titre: 'Exonerations',
    section: 'Champ d\'application',
    themes: ['exonerations', 'cooperatives', 'GIE', 'BEAC'],
    priority: 1,
    defines: ['exonerations IS'],
    keywords: ['cooperatives agricoles', 'collectivites locales'],
  },

  'Art. 108': {
    numero: 'Art. 108',
    titre: 'Territorialite',
    section: 'Champ d\'application',
    themes: ['territorialite', 'etablissement stable'],
    priority: 1,
    defines: ['territorialite IS', 'cycle commercial'],
  },

  // ========== SECTION 3 - BENEFICE IMPOSABLE ==========
  'Art. 109': {
    numero: 'Art. 109',
    titre: 'Definition du benefice net',
    section: 'Benefice imposable',
    themes: ['benefice net', 'benefice imposable'],
    priority: 1,
    defines: ['benefice net imposable'],
  },

  'Art. 109-A': {
    numero: 'Art. 109-A',
    titre: 'Actif net',
    section: 'Benefice imposable',
    themes: ['actif net'],
    priority: 2,
  },

  'Art. 109-B': {
    numero: 'Art. 109-B',
    titre: 'Conditions de deductibilite',
    section: 'Benefice imposable',
    themes: ['conditions deductibilite', 'charges deductibles', 'acte anormal de gestion'],
    priority: 1,
    defines: ['conditions de deductibilite'],
  },

  'Art. 109-C': {
    numero: 'Art. 109-C',
    titre: 'Microfinance',
    section: 'Benefice imposable',
    themes: ['microfinance'],
    priority: 2,
  },

  // ========== CHARGES DE PERSONNEL ==========
  'Art. 110': {
    numero: 'Art. 110',
    titre: 'Remunerations des salaries',
    section: 'Charges de personnel',
    themes: ['charges personnel', 'remunerations', 'salaires'],
    priority: 1,
    defines: ['charges de personnel deductibles'],
  },

  'Art. 110-A': {
    numero: 'Art. 110-A',
    titre: 'Gerants majoritaires SARL',
    section: 'Charges de personnel',
    themes: ['gerants majoritaires', 'SARL'],
    priority: 2,
  },

  'Art. 110-B': {
    numero: 'Art. 110-B',
    titre: 'Cotisations retraite',
    section: 'Charges de personnel',
    themes: ['cotisations retraite', 'prevoyance'],
    priority: 2,
    valeurs: ['15%'],
  },

  // ========== REMUNERATIONS VERSEES A L'ETRANGER ==========
  'Art. 111': {
    numero: 'Art. 111',
    titre: 'Frais de siege',
    section: 'Remunerations etranger',
    themes: ['frais de siege', 'remunerations etranger'],
    priority: 1,
    defines: ['frais de siege'],
    valeurs: ['20%'],
  },

  'Art. 111-A': {
    numero: 'Art. 111-A',
    titre: 'Remunerations BTP',
    section: 'Remunerations etranger',
    themes: ['BTP', 'remunerations etranger'],
    priority: 2,
    valeurs: ['2%'],
  },

  'Art. 111-A bis': {
    numero: 'Art. 111-A bis',
    titre: 'Redevances',
    section: 'Remunerations etranger',
    themes: ['redevances', 'brevets', 'licences'],
    priority: 1,
    defines: ['redevances deductibles'],
  },

  'Art. 111-B': {
    numero: 'Art. 111-B',
    titre: 'Commissions',
    section: 'Remunerations etranger',
    themes: ['commissions'],
    priority: 2,
    valeurs: ['5%'],
  },

  // ========== AUTRES FRAIS ET CHARGES ==========
  'Art. 112': {
    numero: 'Art. 112',
    titre: 'Locations',
    section: 'Autres frais',
    themes: ['locations', 'loyers'],
    priority: 2,
  },

  'Art. 112-A': {
    numero: 'Art. 112-A',
    titre: 'Credit-bail',
    section: 'Autres frais',
    themes: ['credit-bail', 'leasing'],
    priority: 1,
    defines: ['credit-bail deductible'],
  },

  'Art. 112-B': {
    numero: 'Art. 112-B',
    titre: 'Impots deductibles',
    section: 'Autres frais',
    themes: ['impots deductibles'],
    priority: 2,
  },

  'Art. 112-C': {
    numero: 'Art. 112-C',
    titre: 'Primes d\'assurance',
    section: 'Autres frais',
    themes: ['assurances', 'primes'],
    priority: 2,
  },

  'Art. 112-D': {
    numero: 'Art. 112-D',
    titre: 'Frais financiers',
    section: 'Autres frais',
    themes: ['frais financiers', 'interets'],
    priority: 1,
    defines: ['frais financiers deductibles'],
  },

  'Art. 112-E': {
    numero: 'Art. 112-E',
    titre: 'Interets des associes',
    section: 'Autres frais',
    themes: ['interets associes', 'compte courant'],
    priority: 1,
    defines: ['interets comptes courants associes'],
    valeurs: ['taux BEAC + 3 points'],
    keywords: ['sous-capitalisation'],
  },

  // ========== CHARGES NON DEDUCTIBLES ==========
  'Art. 113': {
    numero: 'Art. 113',
    titre: 'Dons et liberalites',
    section: 'Charges non deductibles',
    themes: ['dons', 'liberalites'],
    priority: 1,
    defines: ['dons non deductibles'],
    valeurs: ['0,5 pour mille'],
  },

  'Art. 113-A': {
    numero: 'Art. 113-A',
    titre: 'Paiements en especes',
    section: 'Charges non deductibles',
    themes: ['paiement especes', 'SFEC'],
    priority: 1,
    valeurs: ['500.000 FCFA'],
  },

  'Art. 113-B': {
    numero: 'Art. 113-B',
    titre: 'Depenses somptuaires',
    section: 'Charges non deductibles',
    themes: ['depenses somptuaires'],
    priority: 2,
  },

  'Art. 113-C': {
    numero: 'Art. 113-C',
    titre: 'Amendes et penalites',
    section: 'Charges non deductibles',
    themes: ['amendes', 'penalites'],
    priority: 2,
    defines: ['amendes non deductibles'],
  },

  // ========== AMORTISSEMENTS ==========
  'Art. 114': {
    numero: 'Art. 114',
    titre: 'Amortissements - Principe',
    section: 'Amortissements',
    themes: ['amortissements'],
    priority: 1,
    defines: ['amortissements deductibles'],
  },

  'Art. 114-A': {
    numero: 'Art. 114-A',
    titre: 'Taux d\'amortissement',
    section: 'Amortissements',
    themes: ['taux amortissement'],
    priority: 1,
    defines: ['taux d\'amortissement'],
  },

  'Art. 114-B': {
    numero: 'Art. 114-B',
    titre: 'Amortissement lineaire',
    section: 'Amortissements',
    themes: ['amortissement lineaire'],
    priority: 2,
  },

  'Art. 114-C': {
    numero: 'Art. 114-C',
    titre: 'Amortissement degressif',
    section: 'Amortissements',
    themes: ['amortissement degressif'],
    priority: 2,
  },

  'Art. 114-F': {
    numero: 'Art. 114-F',
    titre: 'Amortissement accelere',
    section: 'Amortissements',
    themes: ['amortissement accelere'],
    priority: 1,
    valeurs: ['40%', '400.000.000 FCFA'],
  },

  'Art. 114-G': {
    numero: 'Art. 114-G',
    titre: 'Vehicules de tourisme',
    section: 'Amortissements',
    themes: ['vehicules tourisme', 'plafond amortissement'],
    priority: 1,
    valeurs: ['40.000.000 FCFA'],
  },

  'Art. 114-H': {
    numero: 'Art. 114-H',
    titre: 'Petits materiels',
    section: 'Amortissements',
    themes: ['petits materiels', 'amortissement 100%'],
    priority: 2,
    valeurs: ['500.000 FCFA'],
  },

  // ========== PROVISIONS ==========
  'Art. 115': {
    numero: 'Art. 115',
    titre: 'Provisions - Principe',
    section: 'Provisions',
    themes: ['provisions'],
    priority: 1,
    defines: ['provisions deductibles'],
  },

  'Art. 115-A': {
    numero: 'Art. 115-A',
    titre: 'Creances douteuses',
    section: 'Provisions',
    themes: ['creances douteuses', 'provisions clients'],
    priority: 1,
    defines: ['provisions pour creances douteuses'],
  },

  'Art. 115-B': {
    numero: 'Art. 115-B',
    titre: 'Provisions COBAC',
    section: 'Provisions',
    themes: ['COBAC', 'banques', 'etablissements credit'],
    priority: 2,
  },

  // ========== PLUS-VALUES ==========
  'Art. 118': {
    numero: 'Art. 118',
    titre: 'Regime des plus-values',
    section: 'Plus-values',
    themes: ['plus-values', 'moins-values'],
    priority: 1,
    defines: ['regime des plus-values'],
  },

  'Art. 118-A': {
    numero: 'Art. 118-A',
    titre: 'Remploi des plus-values',
    section: 'Plus-values',
    themes: ['remploi', 'reinvestissement'],
    priority: 1,
    defines: ['regime de remploi'],
    valeurs: ['3 ans'],
  },

  'Art. 118-B': {
    numero: 'Art. 118-B',
    titre: 'Fusions et scissions',
    section: 'Plus-values',
    themes: ['fusions', 'scissions', 'restructurations'],
    priority: 1,
    defines: ['regime fiscal des fusions'],
  },

  // ========== REPORT DEFICITAIRE ==========
  'Art. 119': {
    numero: 'Art. 119',
    titre: 'Report des deficits',
    section: 'Report deficitaire',
    themes: ['report deficits', 'deficits reportables'],
    priority: 1,
    defines: ['report deficitaire'],
    valeurs: ['3 ans'],
  },

  // ========== PRIX DE TRANSFERT ==========
  'Art. 120': {
    numero: 'Art. 120',
    titre: 'Prix de transfert - Principe',
    section: 'Prix de transfert',
    themes: ['prix de transfert', 'parties liees'],
    priority: 1,
    defines: ['prix de transfert', 'entreprises liees'],
  },

  'Art. 120-A': {
    numero: 'Art. 120-A',
    titre: 'Documentation prix de transfert',
    section: 'Prix de transfert',
    themes: ['documentation', 'obligations declaratives'],
    priority: 1,
    valeurs: ['500.000.000 FCFA'],
  },

  'Art. 120-B': {
    numero: 'Art. 120-B',
    titre: 'Methodes de prix de transfert',
    section: 'Prix de transfert',
    themes: ['methodes', 'PCML', 'MTMN', 'OCDE'],
    priority: 1,
    defines: ['methodes prix de transfert'],
  },

  'Art. 120-C': {
    numero: 'Art. 120-C',
    titre: 'APP - Accord prealable de prix',
    section: 'Prix de transfert',
    themes: ['APP', 'accord prealable'],
    priority: 2,
    defines: ['accord prealable de prix'],
    valeurs: ['3 ans'],
  },

  'Art. 120-D': {
    numero: 'Art. 120-D',
    titre: 'Sanctions prix de transfert',
    section: 'Prix de transfert',
    themes: ['sanctions', 'amendes'],
    priority: 2,
    valeurs: ['5.000.000 FCFA', '25.000.000 FCFA'],
  },

  // ========== TAUX ET CALCUL ==========
  'Art. 122': {
    numero: 'Art. 122',
    titre: 'Taux de l\'IS',
    section: 'Calcul de l\'impot',
    themes: ['taux IS', '30%'],
    priority: 1,
    defines: ['taux IS normal'],
    valeurs: ['30%'],
  },

  'Art. 122-A': {
    numero: 'Art. 122-A',
    titre: 'Taux reduits',
    section: 'Calcul de l\'impot',
    themes: ['taux reduits', '25%', '28%', '33%'],
    priority: 1,
    defines: ['taux reduits IS'],
    valeurs: ['25%', '28%', '33%'],
    keywords: ['microfinance', 'enseignement', 'mines', 'immobilier', 'etrangers'],
  },

  'Art. 122-B': {
    numero: 'Art. 122-B',
    titre: 'Imputation IRVM',
    section: 'Calcul de l\'impot',
    themes: ['IRVM', 'imputation'],
    priority: 2,
  },

  // ========== OBLIGATIONS ==========
  'Art. 124': {
    numero: 'Art. 124',
    titre: 'Declaration d\'existence',
    section: 'Obligations',
    themes: ['declaration existence', 'immatriculation'],
    priority: 1,
    defines: ['obligation declaration existence'],
    valeurs: ['3 mois', '15 jours'],
  },

  'Art. 124-A': {
    numero: 'Art. 124-A',
    titre: 'Declaration des resultats',
    section: 'Obligations',
    themes: ['declaration resultats', 'liasse fiscale'],
    priority: 1,
    defines: ['obligation declaration annuelle'],
    valeurs: ['4 mois'],
  },

  'Art. 124-B': {
    numero: 'Art. 124-B',
    titre: 'Acomptes IS',
    section: 'Obligations',
    themes: ['acomptes IS', 'versement spontane'],
    priority: 1,
    defines: ['acomptes IS'],
    valeurs: ['15 fevrier', '15 mai', '15 aout', '15 novembre'],
  },

  'Art. 124-C': {
    numero: 'Art. 124-C',
    titre: 'Cessation d\'activites',
    section: 'Obligations',
    themes: ['cessation', 'fermeture'],
    priority: 2,
    valeurs: ['15 jours'],
  },

  // ========== REGIMES PARTICULIERS ==========
  'Art. 126': {
    numero: 'Art. 126',
    titre: 'Regime mere-fille',
    section: 'Regimes particuliers',
    themes: ['societes meres', 'filiales', 'dividendes'],
    priority: 1,
    defines: ['regime mere-fille'],
    valeurs: ['25%', '10%', '2 ans'],
  },

  'Art. 126-A': {
    numero: 'Art. 126-A',
    titre: 'Subventions et abandons',
    section: 'Regimes particuliers',
    themes: ['subventions', 'abandons de creances'],
    priority: 2,
  },

  'Art. 126-B': {
    numero: 'Art. 126-B',
    titre: 'Succursales',
    section: 'Regimes particuliers',
    themes: ['succursales', 'agences'],
    priority: 2,
    defines: ['regime des succursales'],
  },

  'Art. 126-C-1': {
    numero: 'Art. 126-C-1',
    titre: 'Quartiers generaux',
    section: 'Regimes particuliers',
    themes: ['quartiers generaux', 'CEMAC'],
    priority: 1,
    defines: ['quartiers generaux'],
  },

  'Art. 126-D': {
    numero: 'Art. 126-D',
    titre: 'Holdings',
    section: 'Regimes particuliers',
    themes: ['holdings', 'societe de participation'],
    priority: 1,
    defines: ['regime des holdings'],
    valeurs: ['deux tiers actif', '5 ans'],
  },

  'Art. 126-E': {
    numero: 'Art. 126-E',
    titre: 'Integration fiscale',
    section: 'Regimes particuliers',
    themes: ['integration fiscale', 'groupe fiscal'],
    priority: 1,
    defines: ['integration fiscale'],
    valeurs: ['95%', '5 exercices'],
  },

  'Art. 126-E-1': {
    numero: 'Art. 126-E-1',
    titre: 'Resultat d\'ensemble',
    section: 'Regimes particuliers',
    themes: ['resultat ensemble', 'consolidation'],
    priority: 2,
  },

  'Art. 126-E-2': {
    numero: 'Art. 126-E-2',
    titre: 'Neutralisation',
    section: 'Regimes particuliers',
    themes: ['neutralisation', 'operations internes'],
    priority: 2,
  },

  // ========== PERSONNES MORALES ETRANGERES ==========
  'Art. 126 ter': {
    numero: 'Art. 126 ter',
    titre: 'Personnes morales etrangeres',
    section: 'Personnes morales etrangeres',
    themes: ['personnes morales etrangeres', 'non-residents'],
    priority: 1,
    defines: ['regime personnes morales etrangeres'],
    valeurs: ['22%'],
  },

  'Art. 126 ter A': {
    numero: 'Art. 126 ter A',
    titre: 'Sous-traitants petroliers',
    section: 'Personnes morales etrangeres',
    themes: ['sous-traitants petroliers', 'secteur petrolier'],
    priority: 1,
  },

  'Art. 126 quater C-1': {
    numero: 'Art. 126 quater C-1',
    titre: 'ATE - Autorisation temporaire',
    section: 'Personnes morales etrangeres',
    themes: ['ATE', 'autorisation temporaire'],
    priority: 2,
    defines: ['autorisation temporaire exercer'],
  },

  'Art. 126 quater D': {
    numero: 'Art. 126 quater D',
    titre: 'Quitus fiscal',
    section: 'Personnes morales etrangeres',
    themes: ['quitus fiscal'],
    priority: 1,
    defines: ['quitus fiscal'],
    valeurs: ['100.000.000.000 FCFA'],
  },

  'Art. 126 septies': {
    numero: 'Art. 126 septies',
    titre: 'Zone Angola',
    section: 'Personnes morales etrangeres',
    themes: ['zone Angola', 'retenue speciale'],
    priority: 2,
    valeurs: ['5.75%'],
  },

  'Art. 126 sexies': {
    numero: 'Art. 126 sexies',
    titre: 'Activite petroliere 70%',
    section: 'Personnes morales etrangeres',
    themes: ['activite petroliere', 'derogation'],
    priority: 2,
    valeurs: ['70%'],
  },
};

/**
 * Articles prioritaires par theme pour le reranking
 */
export const PRIORITY_ARTICLES_IS: Record<string, string[]> = {
  'taux': ['Art. 122', 'Art. 122-A', 'Art. 114-A'],
  'exonerations': ['Art. 107-A'],
  'etablissement stable': ['Art. 108'],
  'prix de transfert': ['Art. 120', 'Art. 120-A', 'Art. 120-B', 'Art. 120-C', 'Art. 120-D'],
  'amortissements': ['Art. 114', 'Art. 114-A', 'Art. 114-F', 'Art. 114-G'],
  'deficits': ['Art. 119'],
  'frais siege': ['Art. 111'],
  'mere-fille': ['Art. 126', 'Art. 126-A'],
  'holding': ['Art. 126-D'],
  'integration fiscale': ['Art. 126-E', 'Art. 126-E-1', 'Art. 126-E-2'],
  'personnes morales etrangeres': ['Art. 126 ter', 'Art. 126 ter A'],
  'acomptes': ['Art. 124-B'],
};
