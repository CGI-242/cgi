/**
 * Métadonnées des articles du CGI 2025 - Chapitre 1 : IRPP
 * 
 * Ce fichier enrichit les articles avec des métadonnées pour améliorer
 * la recherche hybride (keyword + vectorielle) dans le RAG.
 * 
 * Types d'articles :
 * - 'définition' : Article qui DÉFINIT un concept (source primaire)
 * - 'application' : Article qui APPLIQUE ou RÉFÉRENCE un concept
 * - 'procédure' : Article sur les procédures déclaratives
 * - 'calcul' : Article sur les méthodes de calcul
 * - 'exonération' : Article listant des exonérations
 * - 'sanction' : Article sur les sanctions et pénalités
 * 
 * Priorité :
 * - 1 : Source primaire (à citer en premier)
 * - 2 : Source secondaire (contexte additionnel)
 * - 3 : Source tertiaire (complément)
 * 
 * @author NORMX AI - CGI 242
 * @version 2025
 */

export interface ArticleMetadata {
  numero: string;
  titre: string;
  type: 'définition' | 'application' | 'procédure' | 'calcul' | 'exonération' | 'sanction';
  priority: 1 | 2 | 3;
  section: string;
  defines?: string[];      // Concepts définis par cet article
  references?: string[];   // Articles référencés
  keywords: string[];      // Mots-clés pour le mapping
  statut: 'en vigueur' | 'abrogé' | 'sans objet';
}

export const ARTICLE_METADATA: Record<string, ArticleMetadata> = {
  // ============================================================
  // SECTION 1 : DISPOSITIONS GÉNÉRALES (Art. 1-11)
  // ============================================================
  
  'Art. 1': {
    numero: 'Art. 1',
    titre: 'Principe de l\'impôt sur le revenu',
    type: 'définition',
    priority: 1,
    section: 'Dispositions générales',
    defines: [
      'catégories de revenus',
      'revenu net global',
      'IRPP',
      'sept catégories',
      '7 catégories'
    ],
    keywords: [
      'catégories de revenus',
      'catégories revenus',
      'sept catégories',
      '7 catégories',
      'revenu net global',
      'revenus fonciers',
      'bénéfices industriels',
      'bénéfices commerciaux',
      'traitements salaires',
      'professions non commerciales',
      'capitaux mobiliers',
      'plus-values',
      'exploitation agricole',
      'IRPP',
      'impôt annuel',
      'personnes physiques',
      'composition du revenu',
      'quelles catégories',
      'liste des revenus'
    ],
    statut: 'en vigueur'
  },

  'Art. 2': {
    numero: 'Art. 2',
    titre: 'Personnes imposables',
    type: 'définition',
    priority: 1,
    section: 'Dispositions générales',
    defines: [
      'personnes imposables',
      'domicile fiscal',
      'résidence habituelle',
      'résidence fiscale'
    ],
    keywords: [
      'personnes imposables',
      'domicile fiscal',
      'résidence habituelle',
      'résidence fiscale',
      'habitation',
      'séjour principal',
      'fonctionnaires',
      'absence prolongée',
      'vingt-quatre mois',
      '24 mois',
      'perte de résidence',
      'durée absence',
      'conventions internationales',
      'nationalité congolaise',
      'nationalité étrangère',
      'revenus source congolaise',
      'qui est imposable',
      'qui paie irpp'
    ],
    statut: 'en vigueur'
  },

  'Art. 3': {
    numero: 'Art. 3',
    titre: 'Personnes affranchies de l\'impôt',
    type: 'exonération',
    priority: 1,
    section: 'Dispositions générales',
    defines: [
      'exonérations IRPP',
      'personnes exonérées',
      'minimum imposable'
    ],
    references: ['Art. 95'],
    keywords: [
      'exonération',
      'affranchis',
      'exonérés',
      'minimum imposable',
      'diplomates',
      'agents diplomatiques',
      'consuls',
      'réciprocité diplomatique',
      'qui est exonéré',
      'pas imposable'
    ],
    statut: 'en vigueur'
  },

  'Art. 4': {
    numero: 'Art. 4',
    titre: 'Imposition par chef de famille et imposition distincte',
    type: 'définition',
    priority: 1,
    section: 'Dispositions générales',
    defines: [
      'chef de famille',
      'foyer fiscal',
      'imposition distincte'
    ],
    references: ['Art. 93'],
    keywords: [
      'chef de famille',
      'foyer fiscal',
      'imposition distincte',
      'femme mariée',
      'enfants à charge',
      'séparation de biens',
      'divorce',
      'abandon domicile',
      'revenus non salariaux',
      'conventions internationales'
    ],
    statut: 'en vigueur'
  },

  'Art. 5': {
    numero: 'Art. 5',
    titre: 'Décès du contribuable ou du conjoint',
    type: 'procédure',
    priority: 2,
    section: 'Dispositions générales',
    defines: ['imposition en cas de décès'],
    keywords: [
      'décès',
      'veuve',
      'revenus non taxés',
      'foyer fiscal',
      'conjoint décédé'
    ],
    statut: 'en vigueur'
  },

  'Art. 6': {
    numero: 'Art. 6',
    titre: 'Imposition des associés et assimilés',
    type: 'application',
    priority: 2,
    section: 'Dispositions générales',
    defines: ['imposition des associés'],
    references: ['Art. 4', 'Art. 107'],
    keywords: [
      'associés',
      'sociétés de personnes',
      'SNC',
      'société en nom collectif',
      'commandités',
      'sociétés civiles',
      'GIE',
      'bénéfices sociaux'
    ],
    statut: 'en vigueur'
  },

  'Art. 7': {
    numero: 'Art. 7',
    titre: 'Imposition à la source par les sociétés',
    type: 'application',
    priority: 2,
    section: 'Dispositions générales',
    defines: ['rémunérations occultes'],
    keywords: [
      'rémunérations occultes',
      'retenue à la source',
      'sociétés',
      'identification bénéficiaire',
      'personnes morales',
      'frais entreprises'
    ],
    statut: 'en vigueur'
  },

  'Art. 8': {
    numero: 'Art. 8',
    titre: 'Lieu d\'imposition',
    type: 'procédure',
    priority: 2,
    section: 'Dispositions générales',
    defines: ['lieu d\'imposition'],
    keywords: [
      'lieu imposition',
      'résidence principale',
      'plusieurs résidences',
      'contribuables étranger',
      'principaux intérêts'
    ],
    statut: 'en vigueur'
  },

  'Art. 9': {
    numero: 'Art. 9',
    titre: 'Changement de situation du contribuable',
    type: 'procédure',
    priority: 3,
    section: 'Dispositions générales',
    keywords: [
      'changement résidence',
      'changement établissement',
      'prescription',
      'nouvelle situation'
    ],
    statut: 'en vigueur'
  },

  'Art. 10': {
    numero: 'Art. 10',
    titre: 'Principe d\'imposition annuelle des revenus',
    type: 'définition',
    priority: 2,
    section: 'Dispositions générales',
    defines: ['imposition annuelle'],
    keywords: [
      'imposition annuelle',
      'revenus réalisés',
      'revenus disponibles',
      'année civile'
    ],
    statut: 'en vigueur'
  },

  'Art. 11': {
    numero: 'Art. 11',
    titre: 'Détermination du revenu global net imposable',
    type: 'calcul',
    priority: 2,
    section: 'Dispositions générales',
    defines: ['calcul du revenu global'],
    references: ['Art. 1', 'Art. 4', 'Art. 6', 'Art. 66'],
    keywords: [
      'revenu global net',
      'produit brut',
      'charges déductibles',
      'déficits',
      'calcul revenu',
      'détermination revenu',
      'bénéfice imposable'
    ],
    statut: 'en vigueur'
  },

  // ============================================================
  // SECTION 2 : REVENUS FONCIERS (Art. 12-13 quater)
  // ============================================================

  'Art. 12': {
    numero: 'Art. 12',
    titre: 'Revenus fonciers – définition',
    type: 'définition',
    priority: 1,
    section: 'Revenus fonciers',
    defines: ['revenus fonciers'],
    references: ['Art. 13'],
    keywords: [
      'revenus fonciers',
      'propriétés bâties',
      'propriétés non bâties',
      'location',
      'loyer',
      'carrières',
      'usufruit',
      'outillage industriel',
      'affichage',
      'redevances tréfoncières'
    ],
    statut: 'en vigueur'
  },

  'Art. 13': {
    numero: 'Art. 13',
    titre: 'Détermination du revenu net foncier',
    type: 'calcul',
    priority: 1,
    section: 'Revenus fonciers',
    defines: ['revenu net foncier'],
    keywords: [
      'revenu net foncier',
      'revenu brut',
      'charges propriété',
      'calcul foncier'
    ],
    statut: 'en vigueur'
  },

  'Art. 13 bis': {
    numero: 'Art. 13 bis',
    titre: 'Détermination du revenu brut foncier',
    type: 'calcul',
    priority: 2,
    section: 'Revenus fonciers',
    defines: ['revenu brut foncier'],
    keywords: [
      'revenu brut',
      'location',
      'charges locatives',
      'propriétaire',
      'locataire',
      'recettes brutes'
    ],
    statut: 'en vigueur'
  },

  'Art. 13 ter': {
    numero: 'Art. 13 ter',
    titre: 'Revenu brut foncier – loyers et prestations',
    type: 'calcul',
    priority: 3,
    section: 'Revenus fonciers',
    keywords: [
      'revenu brut foncier',
      'immeubles en finition',
      'prestations',
      'contrat de bail'
    ],
    statut: 'en vigueur'
  },

  'Art. 13 quater': {
    numero: 'Art. 13 quater',
    titre: 'Charges déductibles pour la détermination du revenu net foncier',
    type: 'calcul',
    priority: 1,
    section: 'Revenus fonciers',
    defines: ['charges déductibles foncier', 'déduction forfaitaire 30%'],
    references: ['Art. 12'],
    keywords: [
      'charges déductibles',
      'revenu net foncier',
      'déduction forfaitaire',
      '30%',
      'trente pour cent',
      'frais réels',
      'option irrévocable',
      'intérêts emprunts',
      'trois années'
    ],
    statut: 'en vigueur'
  },

  // ============================================================
  // SECTION 3 : BICA (Art. 14-35)
  // ============================================================

  'Art. 14': {
    numero: 'Art. 14',
    titre: 'Définition des bénéfices industriels, commerciaux et artisanaux',
    type: 'définition',
    priority: 1,
    section: 'BICA',
    defines: ['BICA', 'bénéfices industriels commerciaux artisanaux'],
    keywords: [
      'BICA',
      'bénéfices industriels',
      'bénéfices commerciaux',
      'bénéfices artisanaux',
      'activité commerciale',
      'activité industrielle',
      'activité artisanale',
      'mines',
      'carrières',
      'hydrocarbures',
      'forêts',
      'concessionnaires'
    ],
    statut: 'en vigueur'
  },

  'Art. 15': {
    numero: 'Art. 15',
    titre: 'Assimilation à des bénéfices industriels et commerciaux',
    type: 'définition',
    priority: 2,
    section: 'BICA',
    defines: ['activités assimilées BIC'],
    keywords: [
      'assimilation BIC',
      'intermédiation',
      'location meublée',
      'fonds de commerce',
      'lotissement',
      'actions',
      'parts sociales',
      'terrains',
      'viabilité'
    ],
    statut: 'en vigueur'
  },

  'Art. 15 bis': {
    numero: 'Art. 15 bis',
    titre: 'Déclaration d\'existence',
    type: 'procédure',
    priority: 2,
    section: 'BICA',
    defines: ['déclaration d\'existence'],
    references: ['Art. 14', 'Art. 15'],
    keywords: [
      'déclaration existence',
      'début activité',
      'quinze jours',
      '15 jours',
      'obligations déclaratives'
    ],
    statut: 'en vigueur'
  },

  'Art. 17': {
    numero: 'Art. 17',
    titre: 'Détermination des bénéfices imposables',
    type: 'calcul',
    priority: 1,
    section: 'BICA',
    defines: ['bénéfice net imposable BICA'],
    references: ['Art. 107', 'Art. 121'],
    keywords: [
      'résultat fiscal',
      'bénéfices imposables',
      'bénéfice net',
      'BICA',
      'actif net',
      'passif',
      'amortissements',
      'provisions',
      'produits réalisés',
      'charges engagées'
    ],
    statut: 'en vigueur'
  },

  'Art. 22': {
    numero: 'Art. 22',
    titre: 'Imposition des plus-values en cas de décès de l\'exploitant',
    type: 'application',
    priority: 2,
    section: 'BICA',
    defines: ['report plus-value décès'],
    keywords: [
      'plus-value',
      'décès',
      'fonds de commerce',
      'succession',
      'report imposition',
      'héritiers ligne directe',
      'conjoint'
    ],
    statut: 'en vigueur'
  },

  'Art. 26': {
    numero: 'Art. 26',
    titre: 'Fixation du bénéfice imposable – régime du forfait',
    type: 'définition',
    priority: 1,
    section: 'Régimes d\'imposition',
    defines: ['régime du forfait', 'seuil forfait', 'déclaration 294'],
    references: ['Art. 30', 'Art. 31', 'Art. 28'],
    keywords: [
      'régime du forfait',
      'forfait',
      'chiffre affaires',
      '100 000 000',
      '100 millions',
      'cent millions',
      'option réel',
      'SMT',
      'système minimal trésorerie',
      'exclusions forfait',
      'sociétés',
      'professions réglementées',
      'boulangers',
      'grossistes',
      'importateurs',
      'quincailleries',
      'déclaration 294',
      'déclaration n°294',
      'formulaire 294',
      'états financiers',
      'bilan',
      'compte de résultat',
      'notes annexes'
    ],
    statut: 'en vigueur'
  },

  'Art. 27': {
    numero: 'Art. 27',
    titre: 'Évaluation administrative du chiffre d\'affaires et du bénéfice',
    type: 'procédure',
    priority: 2,
    section: 'Régimes d\'imposition',
    keywords: [
      'évaluation administrative',
      'bénéfice normal',
      'notification',
      'commission des impôts',
      'recours contentieux',
      '20 jours'
    ],
    statut: 'en vigueur'
  },

  'Art. 28': {
    numero: 'Art. 28',
    titre: 'Régime du forfait – dispositions générales',
    type: 'procédure',
    priority: 1,
    section: 'Régimes d\'imposition',
    defines: ['obligations régime forfait', 'déclaration 294', 'contenu déclaration forfait'],
    references: ['Art. 26'],
    keywords: [
      'impôt global forfaitaire',
      'base de calcul',
      'année civile',
      'déclaration 294',
      'déclaration n°294',
      'formulaire 294',
      'contenu déclaration',
      'SMT',
      'OHADA',
      'registres comptables',
      'paraphe',
      'contrôle fiscal',
      'taxation office',
      '500 000 FCFA',
      'amende',
      'bilan',
      'compte de résultat',
      'notes annexes',
      'états financiers SMT',
      'tableau suivi matériel',
      'état des stocks',
      'état créances dettes'
    ],
    statut: 'en vigueur'
  },

  'Art. 28 bis': {
    numero: 'Art. 28 bis',
    titre: 'Déclaration des fournisseurs',
    type: 'procédure',
    priority: 3,
    section: 'Régimes d\'imposition',
    keywords: [
      'régime forfait',
      'déclaration fournisseurs',
      'obligation trimestrielle',
      'amende',
      '500 000 FCFA'
    ],
    statut: 'en vigueur'
  },

  'Art. 29': {
    numero: 'Art. 29',
    titre: 'Défaut de production des déclarations et documents',
    type: 'sanction',
    priority: 3,
    section: 'Régimes d\'imposition',
    references: ['Art. 28', 'Art. 26'],
    keywords: [
      'défaut production',
      'fixation office',
      'bases imposition'
    ],
    statut: 'en vigueur'
  },

  'Art. 30': {
    numero: 'Art. 30',
    titre: 'Imposition selon le bénéfice réel',
    type: 'définition',
    priority: 1,
    section: 'Régimes d\'imposition',
    defines: ['régime du réel', 'seuil réel'],
    references: ['Art. 78', 'Art. 80'],
    keywords: [
      'bénéfice réel',
      'régime réel',
      'chiffre affaires',
      '100 000 000',
      '100 millions',
      '2 000 000 000',
      '2 milliards',
      'PME',
      'grandes entreprises',
      'moyennes entreprises',
      'déclaration fiscale',
      'certificat moralité fiscale',
      'états financiers',
      'centrale bilans',
      'BEAC'
    ],
    statut: 'en vigueur'
  },

  'Art. 30 bis': {
    numero: 'Art. 30 bis',
    titre: 'Télé-déclaration et télépaiement',
    type: 'procédure',
    priority: 2,
    section: 'Régimes d\'imposition',
    keywords: [
      'télé-déclaration',
      'télépaiement',
      'pénalité',
      '10%',
      'expert-comptable',
      'états financiers',
      'commissaire aux comptes'
    ],
    statut: 'en vigueur'
  },

  'Art. 31': {
    numero: 'Art. 31',
    titre: 'États financiers annuels et déclaration statistique et fiscale',
    type: 'procédure',
    priority: 1,
    section: 'Régimes d\'imposition',
    defines: ['obligations documentaires régime réel'],
    references: ['Art. 30'],
    keywords: [
      'états financiers',
      'OHADA',
      'déclaration statistique fiscale',
      'DSF',
      'support électronique',
      'résultat fiscal',
      'bilan',
      'compte de résultat',
      'tableau flux trésorerie',
      'documents comptables',
      'contrôle fiscal',
      'taxation office',
      'DGID',
      'gestion informatisée',
      'conservation dix ans',
      '10 ans'
    ],
    statut: 'en vigueur'
  },

  'Art. 31 bis': {
    numero: 'Art. 31 bis',
    titre: 'Siège social',
    type: 'procédure',
    priority: 3,
    section: 'Régimes d\'imposition',
    keywords: [
      'siège social',
      'entreprise Congo'
    ],
    statut: 'en vigueur'
  },

  'Art. 31 ter': {
    numero: 'Art. 31 ter',
    titre: 'Clôture de l\'exercice comptable',
    type: 'procédure',
    priority: 2,
    section: 'Régimes d\'imposition',
    defines: ['date clôture exercice'],
    keywords: [
      'clôture exercice',
      '31 décembre',
      'exercice comptable'
    ],
    statut: 'en vigueur'
  },

  'Art. 32': {
    numero: 'Art. 32',
    titre: 'Vérification des déclarations et rectifications',
    type: 'procédure',
    priority: 2,
    section: 'Régimes d\'imposition',
    keywords: [
      'vérification fiscale',
      'rectification',
      'droit réponse',
      'inspecteur',
      'procédure contradictoire',
      '30 jours',
      'trente jours',
      'charge preuve',
      'réclamation contentieuse'
    ],
    statut: 'en vigueur'
  },

  'Art. 33': {
    numero: 'Art. 33',
    titre: 'Taxation d\'office et rectification d\'office',
    type: 'sanction',
    priority: 1,
    section: 'Régimes d\'imposition',
    defines: ['rectification d\'office', 'taxation d\'office'],
    references: ['Art. 30', 'Art. 31'],
    keywords: [
      'taxation office',
      'rectification office',
      'rectification d\'office',
      'procéder rectification',
      'mise en demeure',
      '8 jours',
      'huit jours',
      'preuve',
      'documents comptables',
      'livres registres',
      'résultats imprécis',
      'documents insuffisants'
    ],
    statut: 'en vigueur'
  },

  'Art. 34 ter': {
    numero: 'Art. 34 ter',
    titre: 'Abattement pour l\'enseignement privé et la microfinance',
    type: 'exonération',
    priority: 2,
    section: 'Régimes d\'imposition',
    defines: ['abattement enseignement privé', 'abattement microfinance'],
    keywords: [
      'IRPP',
      'abattement',
      '30%',
      'trente pour cent',
      'enseignement privé',
      'école privée',
      'microentrepreneur',
      'microfinance',
      'abattement dégressif',
      'BICA'
    ],
    statut: 'en vigueur'
  },

  'Art. 35': {
    numero: 'Art. 35',
    titre: 'Détermination du bénéfice des sociétés et associations',
    type: 'application',
    priority: 2,
    section: 'Régimes d\'imposition',
    references: ['Art. 6'],
    keywords: [
      'sociétés',
      'associations',
      'bénéfice réel',
      'procédure vérification'
    ],
    statut: 'en vigueur'
  },

  // ============================================================
  // SECTION 4 : BÉNÉFICES AGRICOLES (Art. 36-A à 36-C)
  // ============================================================

  'Art. 36-A': {
    numero: 'Art. 36-A',
    titre: 'Définition des bénéfices de l\'exploitation agricole',
    type: 'définition',
    priority: 1,
    section: 'Bénéfices agricoles',
    defines: ['bénéfices agricoles'],
    keywords: [
      'bénéfices agricoles',
      'agriculture',
      'élevage',
      'pêche',
      'pisciculture',
      'ostréiculture',
      'aviculture',
      'fermier',
      'métayer',
      'propriétaire exploitant'
    ],
    statut: 'en vigueur'
  },

  'Art. 36-B': {
    numero: 'Art. 36-B',
    titre: 'Exonération des revenus agricoles',
    type: 'exonération',
    priority: 1,
    section: 'Bénéfices agricoles',
    defines: ['exonération agricole'],
    keywords: [
      'exonération',
      'revenus agricoles',
      'agropastoral',
      'pêche continentale',
      'piscicole',
      'IRPP exonéré'
    ],
    statut: 'en vigueur'
  },

  // ============================================================
  // SECTION 5 : TRAITEMENTS ET SALAIRES (Art. 37-41)
  // ============================================================

  'Art. 37': {
    numero: 'Art. 37',
    titre: 'Définition des traitements, salaires, pensions et rentes viagères imposables',
    type: 'définition',
    priority: 1,
    section: 'Traitements et salaires',
    defines: ['traitements et salaires', 'pensions', 'rentes viagères'],
    keywords: [
      'traitements salaires',
      'IRPP',
      'domicile fiscal',
      'pensions',
      'rentes viagères',
      'CEMAC',
      'revenu global',
      'indemnités',
      'remises',
      'gratifications',
      'primes',
      'émoluments'
    ],
    statut: 'en vigueur'
  },

  'Art. 38': {
    numero: 'Art. 38',
    titre: 'Exonérations applicables aux traitements, salaires, pensions et rentes viagères',
    type: 'exonération',
    priority: 1,
    section: 'Traitements et salaires',
    defines: ['exonérations salaires'],
    keywords: [
      'exonérations',
      'traitements salaires',
      'IRPP',
      'allocations familiales',
      'pensions',
      'rentes viagères',
      'invalidité',
      'retraite',
      'chômage',
      'indemnité licenciement',
      'prime intéressement',
      'indemnités kilométriques',
      '15%',
      'frais emploi',
      'allocations spéciales'
    ],
    statut: 'en vigueur'
  },

  'Art. 39': {
    numero: 'Art. 39',
    titre: 'Détermination de la base d\'imposition des traitements, salaires et assimilés',
    type: 'calcul',
    priority: 1,
    section: 'Traitements et salaires',
    defines: ['avantages en nature', 'base imposable salaires'],
    keywords: [
      'avantages en nature',
      'base imposable',
      'traitements salaires',
      'IRPP',
      'logement',
      '20%',
      'domestique',
      '7%',
      'gardiennage',
      'eau éclairage gaz',
      '5%',
      'téléphone',
      '2%',
      'voiture',
      '3%',
      'nourriture',
      'salaire brut',
      'retenues sociales'
    ],
    statut: 'en vigueur'
  },

  'Art. 40': {
    numero: 'Art. 40',
    titre: 'Détermination du montant net du revenu imposable',
    type: 'calcul',
    priority: 2,
    section: 'Traitements et salaires',
    defines: ['déductions salaires'],
    keywords: [
      'déductions',
      'retraite',
      '6%',
      'sécurité sociale',
      'revenu net imposable'
    ],
    statut: 'en vigueur'
  },

  'Art. 41': {
    numero: 'Art. 41',
    titre: 'Déduction forfaitaire pour l\'assiette de l\'impôt',
    type: 'calcul',
    priority: 1,
    section: 'Traitements et salaires',
    defines: ['déduction forfaitaire 20%'],
    references: ['Art. 39', 'Art. 40'],
    keywords: [
      'déduction forfaitaire',
      '20%',
      'vingt pour cent',
      'assiette impôt',
      'abattement salaires'
    ],
    statut: 'en vigueur'
  },

  // ============================================================
  // SECTION 6 : BNC (Art. 42-49)
  // ============================================================

  'Art. 42': {
    numero: 'Art. 42',
    titre: 'Définition des bénéfices des professions non commerciales',
    type: 'définition',
    priority: 1,
    section: 'BNC',
    defines: ['BNC', 'professions non commerciales'],
    references: ['Art. 26', 'Art. 33'],
    keywords: [
      'BNC',
      'professions libérales',
      'professions non commerciales',
      'droits auteur',
      'brevets',
      'opérations bourse',
      'commissions',
      'honoraires',
      'enseignement privé',
      'mandataires PMU',
      'jeux hasard'
    ],
    statut: 'en vigueur'
  },

  'Art. 43': {
    numero: 'Art. 43',
    titre: 'Détermination des bénéfices imposables des professions non commerciales',
    type: 'calcul',
    priority: 1,
    section: 'BNC',
    defines: ['calcul BNC'],
    keywords: [
      'BNC',
      'détermination bénéfice',
      'charges déductibles',
      'droits auteur',
      'amortissements',
      'frais généraux',
      'loyer locaux professionnels',
      'recettes totales',
      'dépenses'
    ],
    statut: 'en vigueur'
  },

  'Art. 47 ter': {
    numero: 'Art. 47 ter',
    titre: 'Rémunérations versées aux étrangers',
    type: 'application',
    priority: 2,
    section: 'BNC',
    keywords: [
      'droits auteur',
      'artistes étrangers',
      'imposition',
      'prestations Congo'
    ],
    statut: 'en vigueur'
  },

  'Art. 48': {
    numero: 'Art. 48',
    titre: 'Imposition des non-résidents sans installation permanente',
    type: 'application',
    priority: 2,
    section: 'BNC',
    references: ['Art. 42', 'Art. 2'],
    keywords: [
      'non-résidents',
      'BNC',
      'UDEAC',
      'installation permanente'
    ],
    statut: 'en vigueur'
  },

  'Art. 49': {
    numero: 'Art. 49',
    titre: 'Détermination du montant net imposable',
    type: 'calcul',
    priority: 2,
    section: 'BNC',
    references: ['Art. 185 ter A'],
    keywords: [
      'non-résidents',
      'artistes',
      'retenue source',
      'représentant légal',
      'music-hall',
      'musiciens'
    ],
    statut: 'en vigueur'
  },

  // ============================================================
  // SECTION 7 : REVENUS DES CAPITAUX MOBILIERS (Art. 50-62)
  // ============================================================

  'Art. 50': {
    numero: 'Art. 50',
    titre: 'Définition des revenus des capitaux mobiliers',
    type: 'définition',
    priority: 1,
    section: 'Revenus des capitaux mobiliers',
    defines: ['revenus des capitaux mobiliers'],
    references: ['Art. 107'],
    keywords: [
      'revenus capitaux mobiliers',
      'dividendes',
      'parts sociales',
      'IRPP',
      'personnes morales',
      'impôt sociétés',
      'commanditaires'
    ],
    statut: 'en vigueur'
  },

  'Art. 51': {
    numero: 'Art. 51',
    titre: 'Définition des revenus distribués',
    type: 'définition',
    priority: 1,
    section: 'Revenus des capitaux mobiliers',
    defines: ['revenus distribués', 'dividendes'],
    keywords: [
      'revenus distribués',
      'dividendes',
      'réserves',
      'IRCM',
      'IRPP',
      'bénéfices non mis en réserve'
    ],
    statut: 'en vigueur'
  },

  'Art. 52': {
    numero: 'Art. 52',
    titre: 'Revenus non considérés comme distribués',
    type: 'exonération',
    priority: 2,
    section: 'Revenus des capitaux mobiliers',
    keywords: [
      'revenus non distribués',
      'remboursement apport',
      'primes émission',
      'fusion',
      'liquidation',
      'amortissements capital'
    ],
    statut: 'en vigueur'
  },

  'Art. 53': {
    numero: 'Art. 53',
    titre: 'Incorporation directe des bénéfices au capital',
    type: 'application',
    priority: 3,
    section: 'Revenus des capitaux mobiliers',
    keywords: [
      'incorporation bénéfices',
      'capital',
      'réserves'
    ],
    statut: 'en vigueur'
  },

  'Art. 54': {
    numero: 'Art. 54',
    titre: 'Distributions gratuites d\'actions',
    type: 'exonération',
    priority: 2,
    section: 'Revenus des capitaux mobiliers',
    references: ['Art. 118-c'],
    keywords: [
      'actions gratuites',
      'augmentation capital',
      'exonération',
      'IRCM',
      'apports'
    ],
    statut: 'en vigueur'
  },

  'Art. 55': {
    numero: 'Art. 55',
    titre: 'Répartition de la masse des revenus distribués',
    type: 'procédure',
    priority: 3,
    section: 'Revenus des capitaux mobiliers',
    references: ['Art. 51', 'Art. 52', 'Art. 126'],
    keywords: [
      'revenus distribués',
      'répartition',
      'bénéficiaires',
      'déclarations'
    ],
    statut: 'en vigueur'
  },

  'Art. 56': {
    numero: 'Art. 56',
    titre: 'Imposition des distributions excédentaires ou non déclarées',
    type: 'sanction',
    priority: 2,
    section: 'Revenus des capitaux mobiliers',
    keywords: [
      'distributions excédentaires',
      'distributions non déclarées',
      'taux maximum IRPP',
      'personne morale'
    ],
    statut: 'en vigueur'
  },

  'Art. 57': {
    numero: 'Art. 57',
    titre: 'Tantièmes et jetons de présence',
    type: 'application',
    priority: 2,
    section: 'Revenus des capitaux mobiliers',
    keywords: [
      'tantièmes',
      'jetons présence',
      'conseil administration',
      'sociétés anonymes',
      'administrateurs'
    ],
    statut: 'en vigueur'
  },

  'Art. 58': {
    numero: 'Art. 58',
    titre: 'Revenus des obligations',
    type: 'définition',
    priority: 2,
    section: 'Revenus des capitaux mobiliers',
    defines: ['revenus des obligations'],
    keywords: [
      'obligations',
      'intérêts',
      'arrérages',
      'titres emprunt',
      'effets publics',
      'primes remboursement',
      'lots'
    ],
    statut: 'en vigueur'
  },

  'Art. 59': {
    numero: 'Art. 59',
    titre: 'Détermination du revenu des obligations',
    type: 'calcul',
    priority: 2,
    section: 'Revenus des capitaux mobiliers',
    keywords: [
      'revenus obligations',
      'primes remboursement',
      'IRCM',
      'taux émission'
    ],
    statut: 'en vigueur'
  },

  'Art. 60': {
    numero: 'Art. 60',
    titre: 'Revenus des valeurs mobilières émis hors du Congo',
    type: 'définition',
    priority: 2,
    section: 'Revenus des capitaux mobiliers',
    references: ['Art. 2'],
    keywords: [
      'revenus étrangers',
      'dividendes',
      'parts sociales',
      'sociétés étrangères',
      'obligations',
      'trusts',
      'royalties',
      'lots',
      'primes remboursement',
      'siège social étranger'
    ],
    statut: 'en vigueur'
  },

  'Art. 61': {
    numero: 'Art. 61',
    titre: 'Revenus des créances, dépôts et cautionnements',
    type: 'définition',
    priority: 2,
    section: 'Revenus des capitaux mobiliers',
    references: ['Art. 14', 'Art. 15', 'Art. 59', 'Art. 60', 'Art. 171 sexies'],
    keywords: [
      'créances',
      'dépôts',
      'cautionnements',
      'intérêts',
      'bons caisse',
      'comptes courants',
      '15%'
    ],
    statut: 'en vigueur'
  },

  'Art. 62': {
    numero: 'Art. 62',
    titre: 'Exemptions relatives aux revenus des créances',
    type: 'exonération',
    priority: 2,
    section: 'Revenus des capitaux mobiliers',
    keywords: [
      'exemptions',
      'crédit agricole',
      'coopératives agricoles',
      'bons Trésor',
      'coopératives',
      'livrets épargne',
      '5 ans'
    ],
    statut: 'en vigueur'
  },

  // ============================================================
  // SECTION 8 : PLUS-VALUES (Art. 63-63 ter)
  // ============================================================

  'Art. 63': {
    numero: 'Art. 63',
    titre: 'Imposition des plus-values de cession',
    type: 'définition',
    priority: 1,
    section: 'Plus-values',
    defines: ['plus-values de cession'],
    references: ['Art. 22'],
    keywords: [
      'plus-values',
      'cession',
      'actif immobilisé',
      'cessation activité',
      'fonds commerce',
      'régime forfait',
      'exonération',
      '5 ans',
      'cinq ans',
      'moitié montant',
      'tiers montant'
    ],
    statut: 'en vigueur'
  },

  'Art. 63 bis': {
    numero: 'Art. 63 bis',
    titre: 'Imposition des plus-values lors de la cessation d\'activité',
    type: 'application',
    priority: 2,
    section: 'Plus-values',
    references: ['Art. 63'],
    keywords: [
      'cessation activité',
      'plus-values',
      'imposition intégrale',
      'quitter Congo'
    ],
    statut: 'en vigueur'
  },

  'Art. 63 ter': {
    numero: 'Art. 63 ter',
    titre: 'Imposition des plus-values du patrimoine privé',
    type: 'définition',
    priority: 1,
    section: 'Plus-values',
    defines: ['plus-values immobilières', 'taxe 10%'],
    keywords: [
      'plus-values immobilières',
      'patrimoine privé',
      'registre foncier',
      'taux 10%',
      'dix pour cent',
      'retenue source',
      'notaire',
      'recouvrement',
      'vente immobilière',
      'échange',
      'partage',
      'expropriation',
      'apport société',
      'liquidation',
      '7%',
      '5%',
      'dix ans'
    ],
    statut: 'en vigueur'
  },

  // ============================================================
  // SECTION 9 : CHARGES ET REVENU GLOBAL (Art. 64-75)
  // ============================================================

  'Art. 64': {
    numero: 'Art. 64',
    titre: 'Déduction du salaire du conjoint de l\'exploitant',
    type: 'calcul',
    priority: 2,
    section: 'Charges déductibles',
    defines: ['salaire conjoint déductible'],
    references: ['Art. 39', 'Art. 41', 'Art. 6'],
    keywords: [
      'salaire conjoint',
      'exploitant individuel',
      'déduction',
      '1 200 000 FCFA',
      'prorata temporis'
    ],
    statut: 'en vigueur'
  },

  'Art. 65': {
    numero: 'Art. 65',
    titre: 'Revenus professionnels de catégories différentes',
    type: 'application',
    priority: 3,
    section: 'Charges déductibles',
    references: ['Art. 14', 'Art. 15'],
    keywords: [
      'revenus professionnels',
      'catégories différentes',
      'BNC',
      'BICA',
      'IRPP'
    ],
    statut: 'en vigueur'
  },

  'Art. 65 bis': {
    numero: 'Art. 65 bis',
    titre: 'Charges à caractère mixte',
    type: 'calcul',
    priority: 2,
    section: 'Charges déductibles',
    defines: ['charges mixtes déductibles'],
    keywords: [
      'charges mixtes',
      'plafond 2/3',
      'deux tiers',
      'BICA',
      'BNC',
      'bénéfices agricoles'
    ],
    statut: 'en vigueur'
  },

  'Art. 66': {
    numero: 'Art. 66',
    titre: 'Revenu global imposable',
    type: 'définition',
    priority: 1,
    section: 'Revenu global',
    defines: ['revenu global imposable', 'charges déductibles du revenu global'],
    references: ['Art. 2'],
    keywords: [
      'revenu global',
      'revenu imposable',
      'déficits',
      'report déficit',
      '3 ans',
      'trois ans',
      'charges déductibles',
      'intérêts emprunts',
      '1 000 000 FCFA',
      'pensions alimentaires',
      '1 200 000 FCFA',
      'honoraires médicaux',
      '200 000 FCFA',
      '10%',
      'assurance vie',
      'retraite complémentaire',
      'arrérages rente'
    ],
    statut: 'en vigueur'
  },

  'Art. 67': {
    numero: 'Art. 67',
    titre: 'Évaluation des revenus nets catégoriels',
    type: 'application',
    priority: 2,
    section: 'Revenu global',
    keywords: [
      'revenu global',
      'revenus catégoriels',
      'source congolaise',
      'UDEAC',
      'bénéfices forfaitaires'
    ],
    statut: 'en vigueur'
  },

  'Art. 68': {
    numero: 'Art. 68',
    titre: 'Imposition des plus-values de cession de droits sociaux',
    type: 'calcul',
    priority: 2,
    section: 'Revenu global',
    keywords: [
      'plus-values',
      'cession droits sociaux',
      'actionnaire',
      'associé',
      'IRPP',
      'parts bénéficiaires',
      'cessions échelonnées',
      'tiers montant',
      '25%',
      '1962'
    ],
    statut: 'en vigueur'
  },

  'Art. 69': {
    numero: 'Art. 69',
    titre: 'Imposition des bons attribués lors des liquidations',
    type: 'application',
    priority: 3,
    section: 'Revenu global',
    keywords: [
      'liquidation',
      'bons',
      'droits sociaux',
      'IRCM',
      'IRPP',
      'rachat parts'
    ],
    statut: 'en vigueur'
  },

  'Art. 70': {
    numero: 'Art. 70',
    titre: 'Réserves des sociétés en commandite par actions',
    type: 'application',
    priority: 3,
    section: 'Revenu global',
    keywords: [
      'réserves',
      'sociétés commandite actions',
      'distribution',
      'associés gérants',
      'bénéfices sociaux'
    ],
    statut: 'en vigueur'
  },

  'Art. 71': {
    numero: 'Art. 71',
    titre: 'Revenus exceptionnels',
    type: 'calcul',
    priority: 2,
    section: 'Revenu global',
    defines: ['étalement revenus exceptionnels'],
    keywords: [
      'revenu exceptionnel',
      'étalement',
      'plus-value',
      'fonds commerce',
      'distribution réserves',
      'IRPP',
      'trois dernières années'
    ],
    statut: 'en vigueur'
  },

  'Art. 72': {
    numero: 'Art. 72',
    titre: 'Imposition des étrangers et non-domiciliés',
    type: 'application',
    priority: 2,
    section: 'Revenu global',
    references: ['Art. 2'],
    keywords: [
      'non-résidents',
      'revenus source congolaise',
      'représentant fiscal',
      'étrangers',
      'garanties fiscales',
      '20 jours'
    ],
    statut: 'en vigueur'
  },

  'Art. 73': {
    numero: 'Art. 73',
    titre: 'Revenu imposable forfaitaire des étrangers',
    type: 'calcul',
    priority: 2,
    section: 'Revenu global',
    keywords: [
      'revenu forfaitaire',
      'résidences',
      'valeur locative',
      'non-domiciliés',
      'base imposable',
      '5 fois',
      'cinq fois'
    ],
    statut: 'en vigueur'
  },

  'Art. 74': {
    numero: 'Art. 74',
    titre: 'Revenus de l\'année d\'acquisition d\'un domicile au Congo',
    type: 'application',
    priority: 3,
    section: 'Revenu global',
    keywords: [
      'domicile fiscal',
      'transfert résidence',
      'année imposition',
      'établissement domicile',
      'prorata temporis'
    ],
    statut: 'en vigueur'
  },

  'Art. 75': {
    numero: 'Art. 75',
    titre: 'Revenus de l\'année de transfert du domicile hors du Congo ou d\'abandon de résidence',
    type: 'procédure',
    priority: 1,
    section: 'Revenu global',
    defines: ['imposition au départ du Congo'],
    keywords: [
      'transfert domicile',
      'départ Congo',
      'déclaration provisoire',
      'visa départ',
      'garanties fiscales',
      'IRPP',
      'abandon résidence',
      '30 jours',
      'trente jours'
    ],
    statut: 'en vigueur'
  },

  // ============================================================
  // SECTION 10 : DÉCLARATIONS (Art. 76-80)
  // ============================================================

  'Art. 76': {
    numero: 'Art. 76',
    titre: 'Obligation de déclaration du revenu global',
    type: 'procédure',
    priority: 1,
    section: 'Déclarations',
    defines: ['obligation déclaration IRPP'],
    keywords: [
      'déclaration revenus',
      'revenu global',
      'IRPP',
      'catégories revenus',
      'revenus fonciers',
      'BICA',
      'salaires',
      'valeurs mobilières',
      'revenus étrangers',
      'revenus exonérés',
      'train de vie',
      'plus-values',
      'droits sociaux',
      'foi du serment'
    ],
    statut: 'en vigueur'
  },

  'Art. 77': {
    numero: 'Art. 77',
    titre: 'Justification de la situation de famille et des charges déductibles',
    type: 'procédure',
    priority: 2,
    section: 'Déclarations',
    references: ['Art. 66'],
    keywords: [
      'situation famille',
      'charges déductibles',
      'état charges',
      'dettes',
      'rentes obligatoires',
      'impôts directs',
      'justificatifs'
    ],
    statut: 'en vigueur'
  },

  'Art. 78': {
    numero: 'Art. 78',
    titre: 'Forme et dépôt des déclarations',
    type: 'procédure',
    priority: 2,
    section: 'Déclarations',
    keywords: [
      'formulaires déclaration',
      'dépôt déclaration',
      'inspection divisionnaire',
      'pénalité retard',
      'contributions directes'
    ],
    statut: 'en vigueur'
  },

  'Art. 79': {
    numero: 'Art. 79',
    titre: 'Déclaration des contribuables imposés d\'après le bénéfice réel',
    type: 'procédure',
    priority: 2,
    section: 'Déclarations',
    references: ['Art. 31', 'Art. 80'],
    keywords: [
      'bénéfice réel',
      'déclaration annuelle',
      'chiffre affaires',
      'bénéfice imposable',
      'déficit',
      'experts comptables',
      'comptables agréés',
      'inspecteur divisionnaire'
    ],
    statut: 'en vigueur'
  },

  'Art. 80': {
    numero: 'Art. 80',
    titre: 'Délais de dépôt des déclarations',
    type: 'procédure',
    priority: 1,
    section: 'Déclarations',
    defines: ['délai déclaration IRPP'],
    keywords: [
      'délai déclaration',
      '20 mars',
      'vingt mars',
      'revenus fonciers',
      'salaires',
      'pensions',
      'capitaux mobiliers',
      'plus-values',
      'fiscalité particuliers',
      'BICA',
      'BNC',
      'OHADA',
      'solde liquidation',
      'crédit impôt',
      'acomptes IRPP',
      'unité entreprises'
    ],
    statut: 'en vigueur'
  },

  // ============================================================
  // SECTION 11 : VÉRIFICATION (Art. 81-88)
  // ============================================================

  'Art. 81': {
    numero: 'Art. 81',
    titre: 'Déclaration des biens mobiliers détenus hors du Congo',
    type: 'procédure',
    priority: 2,
    section: 'Vérification',
    references: ['Art. 80'],
    keywords: [
      'biens mobiliers',
      'hors Congo',
      'déclaration obligatoire',
      'foi serment',
      'actif étranger',
      'inspecteur divisionnaire'
    ],
    statut: 'en vigueur'
  },

  'Art. 82': {
    numero: 'Art. 82',
    titre: 'Vérification des déclarations',
    type: 'procédure',
    priority: 2,
    section: 'Vérification',
    references: ['Art. 66', 'Art. 62'],
    keywords: [
      'vérification',
      'inspecteur divisionnaire',
      'éclaircissements',
      'contrôle fiscal',
      'justifications',
      'charges famille',
      'bons et titres'
    ],
    statut: 'en vigueur'
  },

  'Art. 83': {
    numero: 'Art. 83',
    titre: 'Modalités des demandes d\'éclaircissements et justifications',
    type: 'procédure',
    priority: 2,
    section: 'Vérification',
    keywords: [
      'demande verbale',
      'demande écrite',
      'refus réponse',
      'délai réponse',
      'éclaircissements',
      'justifications'
    ],
    statut: 'en vigueur'
  },

  'Art. 84': {
    numero: 'Art. 84',
    titre: 'Rectification des déclarations',
    type: 'procédure',
    priority: 2,
    section: 'Vérification',
    keywords: [
      'rectification',
      'base imposition',
      'notification préalable',
      'acceptation',
      'observations',
      'délai'
    ],
    statut: 'en vigueur'
  },

  'Art. 85': {
    numero: 'Art. 85',
    titre: 'Vérification des déclarations BICA et BNC',
    type: 'procédure',
    priority: 3,
    section: 'Vérification',
    references: ['Art. 32', 'Art. 47'],
    keywords: [
      'BICA',
      'BNC',
      'vérification',
      'article 32',
      'article 47'
    ],
    statut: 'en vigueur'
  },

  'Art. 86': {
    numero: 'Art. 86',
    titre: 'Taxation d\'office',
    type: 'sanction',
    priority: 1,
    section: 'Taxation d\'office',
    defines: ['taxation d\'office IRPP'],
    references: ['Art. 78', 'Art. 79', 'Art. 80', 'Art. 81', 'Art. 83', 'Art. 84'],
    keywords: [
      'taxation office',
      'défaut déclaration',
      'délai',
      'mise en demeure',
      'charge preuve',
      'rectification',
      'éclaircissements',
      'justifications',
      '20 jours'
    ],
    statut: 'en vigueur'
  },

  'Art. 87': {
    numero: 'Art. 87',
    titre: 'Taxation d\'office - Représentant au Congo',
    type: 'sanction',
    priority: 2,
    section: 'Taxation d\'office',
    references: ['Art. 72'],
    keywords: [
      'taxation office',
      'IRPP',
      'représentant',
      'non-résident'
    ],
    statut: 'en vigueur'
  },

  'Art. 88': {
    numero: 'Art. 88',
    titre: 'Contestation de la taxation d\'office',
    type: 'procédure',
    priority: 2,
    section: 'Taxation d\'office',
    keywords: [
      'taxation office',
      'contentieux',
      'décharge',
      'réduction',
      'charge preuve',
      'expertise',
      'charge non déductible'
    ],
    statut: 'en vigueur'
  },

  // ============================================================
  // SECTION 12 : CALCUL DE L'IMPÔT (Art. 89-97)
  // ============================================================

  'Art. 89': {
    numero: 'Art. 89',
    titre: 'Mécanisme de calcul de l\'IRPP',
    type: 'calcul',
    priority: 1,
    section: 'Calcul de l\'impôt',
    defines: ['mécanisme calcul IRPP'],
    references: ['Art. 91', 'Art. 95'],
    keywords: [
      'calcul IRPP',
      'revenu imposable',
      'parts',
      'quotient familial',
      'article 91',
      'article 95',
      'IRCM',
      'UDEAC',
      'taxe immobilière',
      'crédit impôt'
    ],
    statut: 'en vigueur'
  },

  'Art. 89 bis': {
    numero: 'Art. 89 bis',
    titre: 'Barème d\'évaluation du train de vie',
    type: 'calcul',
    priority: 2,
    section: 'Calcul de l\'impôt',
    references: ['Art. 76-4'],
    keywords: [
      'train de vie',
      'barème',
      'évaluation',
      'valeur locative',
      'résidence principale',
      'résidence secondaire',
      'employé maison',
      '300 000 FCFA',
      'véhicules',
      'avion tourisme',
      'yachts',
      'bateaux plaisance',
      '1,5 fois'
    ],
    statut: 'en vigueur'
  },

  'Art. 89 quater': {
    numero: 'Art. 89 quater',
    titre: 'Imputation de la retenue sur les BNC',
    type: 'calcul',
    priority: 2,
    section: 'Calcul de l\'impôt',
    references: ['Art. 127 quater'],
    keywords: [
      'retenue',
      'imputation',
      'BNC',
      'report',
      '5 ans',
      'cinq ans'
    ],
    statut: 'en vigueur'
  },

  'Art. 90': {
    numero: 'Art. 90',
    titre: 'Fonctionnaires congolais des organisations internationales',
    type: 'application',
    priority: 3,
    section: 'Calcul de l\'impôt',
    keywords: [
      'fonctionnaires',
      'organisations internationales',
      'nationalité congolaise',
      'exonération',
      'revenus annexes',
      'conventions internationales',
      'double imposition',
      'déduction proportionnelle'
    ],
    statut: 'en vigueur'
  },

  'Art. 91': {
    numero: 'Art. 91',
    titre: 'Nombre de parts - Quotient familial',
    type: 'définition',
    priority: 1,
    section: 'Calcul de l\'impôt',
    defines: ['quotient familial', 'nombre de parts'],
    references: ['Art. 89'],
    keywords: [
      'nombre de parts',
      'parts fiscales',
      'quotient familial',
      'foyer fiscal',
      'IRPP',
      'célibataire',
      'divorcé',
      'veuf',
      'marié',
      'enfants à charge',
      'situation familiale',
      'barème parts',
      'calcul parts',
      '1 part',
      '2 parts',
      '2,5 parts',
      '3 parts',
      '3,5 parts',
      '6,5 parts',
      'demi-part',
      'combien de parts'
    ],
    statut: 'en vigueur'
  },

  'Art. 92-1': {
    numero: 'Art. 92-1',
    titre: 'Demi-part supplémentaire - Cas particuliers',
    type: 'application',
    priority: 2,
    section: 'Calcul de l\'impôt',
    keywords: [
      'demi-part',
      'célibataire',
      'divorcé',
      'veuf',
      'enfants majeurs',
      'enfants décédés',
      'fait guerre',
      'invalidité',
      'pension',
      'accident travail',
      '40%',
      'adoption',
      'enfant infirme',
      'agents État',
      'secteur parapublic'
    ],
    statut: 'en vigueur'
  },

  'Art. 93': {
    numero: 'Art. 93',
    titre: 'Personnes à charge du contribuable',
    type: 'définition',
    priority: 1,
    section: 'Calcul de l\'impôt',
    defines: ['personnes à charge', 'enfants à charge'],
    keywords: [
      'enfants à charge',
      'enfants légitimes',
      'enfants reconnus',
      'enfants adoptés',
      'moins 21 ans',
      '21 ans',
      'infirmes',
      'études',
      '25 ans',
      'enfants recueillis'
    ],
    statut: 'en vigueur'
  },

  'Art. 93 bis': {
    numero: 'Art. 93 bis',
    titre: 'Garde fiscale des enfants - Femmes',
    type: 'procédure',
    priority: 2,
    section: 'Calcul de l\'impôt',
    keywords: [
      'garde fiscale',
      'enfants',
      'femmes mariées',
      'femmes célibataires',
      'femmes divorcées',
      'femmes veuves',
      'décision tribunal',
      'revenus salariaux'
    ],
    statut: 'en vigueur'
  },

  'Art. 94': {
    numero: 'Art. 94',
    titre: 'Date d\'appréciation de la situation familiale',
    type: 'procédure',
    priority: 2,
    section: 'Calcul de l\'impôt',
    references: ['Art. 101'],
    keywords: [
      'situation familiale',
      'charges famille',
      '1er janvier',
      '31 décembre',
      'mariage',
      'décès'
    ],
    statut: 'en vigueur'
  },

  'Art. 95': {
    numero: 'Art. 95',
    titre: 'Barème de l\'IRPP',
    type: 'définition',
    priority: 1,
    section: 'Calcul de l\'impôt',
    defines: ['barème IRPP', 'taux IRPP', 'tranches IRPP'],
    references: ['Art. 2', 'Art. 7', 'Art. 96'],
    keywords: [
      'barème IRPP',
      'taux',
      '1%',
      'un pour cent',
      '10%',
      'dix pour cent',
      '25%',
      'vingt-cinq pour cent',
      '40%',
      'quarante pour cent',
      'tranches',
      '464 000 FCFA',
      '1 000 000 FCFA',
      '3 000 000 FCFA',
      'salaire minimum',
      'SMIG',
      'minimum 20%',
      'taux maximum',
      'sociétés',
      'personnes morales'
    ],
    statut: 'en vigueur'
  },

  'Art. 96': {
    numero: 'Art. 96',
    titre: 'Retenue à la source - 20%',
    type: 'application',
    priority: 2,
    section: 'Calcul de l\'impôt',
    references: ['Art. 2', 'Art. 48', 'Art. 172', 'Art. 379', 'Art. 95', 'Art. 76'],
    keywords: [
      'retenue source',
      '20%',
      'vingt pour cent',
      'dispense déclaration',
      'non-résidents'
    ],
    statut: 'en vigueur'
  },

  'Art. 97': {
    numero: 'Art. 97',
    titre: 'Imputation de l\'IRCM sur l\'IRPP',
    type: 'calcul',
    priority: 2,
    section: 'Calcul de l\'impôt',
    references: ['Art. 61-1-5°'],
    keywords: [
      'IRCM',
      'imputation',
      'capitaux mobiliers',
      'UDEAC',
      'pas restitution'
    ],
    statut: 'en vigueur'
  },

  // ============================================================
  // SECTION 13 : CESSION, CESSATION, DÉCÈS (Art. 98-101)
  // ============================================================

  'Art. 98-1': {
    numero: 'Art. 98-1',
    titre: 'Cession, cessation ou décès - Obligations déclaratives',
    type: 'procédure',
    priority: 1,
    section: 'Cession, cessation, décès',
    defines: ['obligations en cas de cession'],
    references: ['Art. 27', 'Art. 63', 'Art. 30', 'Art. 34', 'Art. 372'],
    keywords: [
      'cession',
      'cessation',
      'décès',
      '15 jours',
      'quinze jours',
      'fonds commerce',
      'journal annonces légales',
      'forfait',
      'prorata',
      'plus-values',
      'bénéfice réel',
      'compte résultat',
      'taxation office'
    ],
    statut: 'en vigueur'
  },

  'Art. 98-2': {
    numero: 'Art. 98-2',
    titre: 'Décès de l\'exploitant',
    type: 'procédure',
    priority: 2,
    section: 'Cession, cessation, décès',
    keywords: [
      'décès',
      'exploitant',
      'ayants droits',
      '6 mois',
      'six mois',
      'succession'
    ],
    statut: 'en vigueur'
  },

  'Art. 99': {
    numero: 'Art. 99',
    titre: 'Cessation d\'une profession non commerciale',
    type: 'procédure',
    priority: 2,
    section: 'Cession, cessation, décès',
    references: ['Art. 46', 'Art. 372'],
    keywords: [
      'profession non commerciale',
      'BNC',
      'cessation',
      'créances acquises',
      '15 jours',
      'taxation office',
      'décès',
      'ayants droits'
    ],
    statut: 'en vigueur'
  },

  'Art. 100': {
    numero: 'Art. 100',
    titre: 'Déduction des impositions antérieures',
    type: 'calcul',
    priority: 2,
    section: 'Cession, cessation, décès',
    references: ['Art. 98', 'Art. 99', 'Art. 66', 'Art. 75'],
    keywords: [
      'déduction',
      'impôt',
      'cession',
      'cessation',
      'décès'
    ],
    statut: 'en vigueur'
  },

  'Art. 101': {
    numero: 'Art. 101',
    titre: 'Imposition en cas de décès du contribuable',
    type: 'procédure',
    priority: 1,
    section: 'Cession, cessation, décès',
    defines: ['imposition en cas de décès'],
    references: ['Art. 66', 'Art. 32', 'Art. 47', 'Art. 83', 'Art. 84'],
    keywords: [
      'décès',
      'IRPP',
      'BICA',
      'revenus',
      'forfait',
      'imposition distincte',
      'ayants droits',
      '6 mois',
      'six mois',
      'déclaration succession'
    ],
    statut: 'en vigueur'
  }
};

/**
 * Récupère les métadonnées d'un article
 */
export function getArticleMetadata(numero: string): ArticleMetadata | undefined {
  // Normaliser le numéro d'article
  const normalizedNumero = numero
    .replace(/^Article\s+/i, 'Art. ')
    .replace(/^art\.\s*/i, 'Art. ')
    .trim();
  
  return ARTICLE_METADATA[normalizedNumero];
}

/**
 * Récupère tous les articles par type
 */
export function getArticlesByType(type: ArticleMetadata['type']): ArticleMetadata[] {
  return Object.values(ARTICLE_METADATA).filter(a => a.type === type && a.statut === 'en vigueur');
}

/**
 * Récupère tous les articles par priorité
 */
export function getArticlesByPriority(priority: 1 | 2 | 3): ArticleMetadata[] {
  return Object.values(ARTICLE_METADATA).filter(a => a.priority === priority && a.statut === 'en vigueur');
}

/**
 * Récupère tous les articles par section
 */
export function getArticlesBySection(section: string): ArticleMetadata[] {
  return Object.values(ARTICLE_METADATA).filter(a => a.section === section && a.statut === 'en vigueur');
}

/**
 * Recherche les articles qui définissent un concept
 */
export function findArticlesThatDefine(concept: string): ArticleMetadata[] {
  const conceptLower = concept.toLowerCase();
  return Object.values(ARTICLE_METADATA).filter(a => 
    a.defines?.some(d => d.toLowerCase().includes(conceptLower)) &&
    a.statut === 'en vigueur'
  );
}
