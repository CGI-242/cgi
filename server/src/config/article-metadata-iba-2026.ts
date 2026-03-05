/**
 * Metadata des articles du CGI 2026 - Chapitre 2
 * IBA, IRCM, IRF, ITS (Art. 93 a 116A)
 *
 * @author NORMX AI - CGI 242
 * @version 2026
 */

export interface ArticleMetadataIBA2026 {
  numero: string;
  titre?: string;
  section: string;
  themes: string[];
  priority: number;
  defines?: string[];
  keywords?: string[];
  valeurs?: string[];
}

export const ARTICLE_METADATA_IBA_2026: Record<string, ArticleMetadataIBA2026> = {
  // ========== IBA - CHAMP D'APPLICATION ==========
  'Art. 93': {
    numero: 'Art. 93',
    titre: 'Principe de l\'IBA',
    section: 'IBA - Champ d\'application',
    themes: ['principe IBA', 'definition IBA'],
    priority: 1,
    defines: ['impot sur les benefices d\'affaires'],
  },

  'Art. 93A': {
    numero: 'Art. 93A',
    titre: 'Revenus imposables a l\'IBA',
    section: 'IBA - Champ d\'application',
    themes: ['revenus imposables', 'BIC', 'BNC', 'professions liberales'],
    priority: 1,
    defines: ['revenus imposables IBA'],
  },

  'Art. 93B': {
    numero: 'Art. 93B',
    titre: 'Personnes imposables',
    section: 'IBA - Champ d\'application',
    themes: ['personnes imposables', 'residence fiscale', 'domicile fiscal'],
    priority: 1,
    defines: ['residence fiscale'],
    valeurs: ['183 jours', '24 mois'],
  },

  'Art. 93C': {
    numero: 'Art. 93C',
    titre: 'Territorialite',
    section: 'IBA - Champ d\'application',
    themes: ['territorialite'],
    priority: 2,
  },

  // ========== IBA - BENEFICE IMPOSABLE ==========
  'Art. 94': {
    numero: 'Art. 94',
    titre: 'Determination du benefice imposable',
    section: 'IBA - Benefice imposable',
    themes: ['benefice imposable', 'amortissement lineaire', 'report deficitaire'],
    priority: 1,
    defines: ['benefice imposable IBA'],
    valeurs: ['3 exercices'],
  },

  'Art. 94A': {
    numero: 'Art. 94A',
    titre: 'Charges non deductibles',
    section: 'IBA - Benefice imposable',
    themes: ['charges non deductibles', 'frais representation'],
    priority: 1,
    defines: ['charges non deductibles IBA'],
    valeurs: ['50%'],
  },

  'Art. 94B': {
    numero: 'Art. 94B',
    titre: 'Regles comptables',
    section: 'IBA - Benefice imposable',
    themes: ['SYSCOHADA', 'comptabilite engagement', 'comptabilite caisse'],
    priority: 2,
  },

  // ========== IBA - MODALITES D'IMPOSITION ==========
  'Art. 95': {
    numero: 'Art. 95',
    titre: 'Taux de l\'IBA',
    section: 'IBA - Modalites',
    themes: ['taux IBA', 'minimum perception'],
    priority: 1,
    defines: ['taux IBA', 'minimum perception IBA'],
    valeurs: ['30%', '1,5%'],
  },

  'Art. 95A': {
    numero: 'Art. 95A',
    titre: 'Report en cas de deces',
    section: 'IBA - Modalites',
    themes: ['deces exploitant', 'heritiers', 'plus-value'],
    priority: 2,
  },

  'Art. 95B': {
    numero: 'Art. 95B',
    titre: 'Societes transparentes',
    section: 'IBA - Modalites',
    themes: ['societes transparentes', 'retenue source'],
    priority: 2,
  },

  // ========== REGIME FORFAIT ==========
  'Art. 96': {
    numero: 'Art. 96',
    titre: 'Regime du forfait',
    section: 'Regime forfait',
    themes: ['regime forfait', 'petites entreprises', 'seuil TVA'],
    priority: 1,
    defines: ['regime forfait'],
    valeurs: ['3 ans option'],
  },

  'Art. 96A': {
    numero: 'Art. 96A',
    titre: 'Obligations comptables forfait',
    section: 'Regime forfait',
    themes: ['SMT', 'registres', 'obligations comptables'],
    priority: 1,
    defines: ['systeme minimal tresorerie'],
  },

  'Art. 97': {
    numero: 'Art. 97',
    titre: 'Evaluation forfaitaire',
    section: 'Regime forfait',
    themes: ['evaluation', 'commission impots'],
    priority: 2,
  },

  'Art. 98': {
    numero: 'Art. 98',
    titre: 'Impot global forfaitaire',
    section: 'Regime forfait',
    themes: ['impot forfaitaire', 'declaration 294'],
    priority: 1,
    valeurs: ['15 fevrier', '100 000 FCFA'],
  },

  'Art. 99': {
    numero: 'Art. 99',
    titre: 'Declaration fournisseurs',
    section: 'Regime forfait',
    themes: ['fournisseurs', 'declaration trimestrielle'],
    priority: 2,
    valeurs: ['500 000 FCFA'],
  },

  'Art. 100': {
    numero: 'Art. 100',
    titre: 'Fixation d\'office',
    section: 'Regime forfait',
    themes: ['taxation office', 'defaut declaration'],
    priority: 2,
  },

  'Art. 101': {
    numero: 'Art. 101',
    titre: 'Fixation d\'office documents',
    section: 'Regime forfait',
    themes: ['taxation office', 'documents comptables'],
    priority: 3,
  },

  // ========== REGIME REEL ==========
  'Art. 102': {
    numero: 'Art. 102',
    titre: 'Regime reel',
    section: 'Regime reel',
    themes: ['regime reel', 'benefice reel'],
    priority: 1,
    defines: ['regime reel'],
  },

  'Art. 103': {
    numero: 'Art. 103',
    titre: 'Teledeclaration',
    section: 'Regime reel',
    themes: ['teledeclaration', 'telepaiement', 'expert-comptable'],
    priority: 1,
    valeurs: ['10%'],
  },

  'Art. 104': {
    numero: 'Art. 104',
    titre: 'Declaration statistique et fiscale',
    section: 'Regime reel',
    themes: ['etats financiers', 'OHADA', 'comptabilite'],
    priority: 1,
    defines: ['declaration statistique fiscale'],
    valeurs: ['10 ans conservation'],
  },

  // ========== IRCM ==========
  'Art. 105': {
    numero: 'Art. 105',
    titre: 'Champ d\'application IRCM',
    section: 'IRCM',
    themes: ['IRCM', 'revenus mobiliers', 'valeurs mobilieres'],
    priority: 1,
    defines: ['impot revenus capitaux mobiliers'],
  },

  'Art. 105A': {
    numero: 'Art. 105A',
    titre: 'Revenus valeurs mobilieres',
    section: 'IRCM',
    themes: ['dividendes', 'revenus distribues'],
    priority: 1,
    defines: ['revenus valeurs mobilieres'],
  },

  'Art. 105B': {
    numero: 'Art. 105B',
    titre: 'Exclusions IRCM',
    section: 'IRCM',
    themes: ['remboursement apports', 'primes emission'],
    priority: 2,
  },

  'Art. 105C': {
    numero: 'Art. 105C',
    titre: 'Revenus obligations',
    section: 'IRCM',
    themes: ['obligations', 'titres participatifs'],
    priority: 2,
  },

  'Art. 105D': {
    numero: 'Art. 105D',
    titre: 'Revenus creances',
    section: 'IRCM',
    themes: ['interets', 'creances', 'comptes courants'],
    priority: 2,
  },

  'Art. 105E': {
    numero: 'Art. 105E',
    titre: 'Plus-values mobilieres',
    section: 'IRCM',
    themes: ['plus-values', 'cession actions'],
    priority: 1,
    defines: ['plus-values mobilieres'],
  },

  'Art. 106': {
    numero: 'Art. 106',
    titre: 'Exonerations IRCM',
    section: 'IRCM',
    themes: ['exonerations', 'fusion'],
    priority: 2,
  },

  'Art. 107': {
    numero: 'Art. 107',
    titre: 'Territorialite IRCM',
    section: 'IRCM',
    themes: ['territorialite', 'cession titres'],
    priority: 2,
    valeurs: ['10%', '365 jours'],
  },

  'Art. 108': {
    numero: 'Art. 108',
    titre: 'Fait generateur IRCM',
    section: 'IRCM',
    themes: ['fait generateur', 'exigibilite'],
    priority: 2,
    valeurs: ['3 mois'],
  },

  'Art. 109': {
    numero: 'Art. 109',
    titre: 'Base d\'imposition IRCM',
    section: 'IRCM',
    themes: ['base imposable', 'moins-values'],
    priority: 2,
    valeurs: ['3 ans'],
  },

  'Art. 110': {
    numero: 'Art. 110',
    titre: 'Taux IRCM',
    section: 'IRCM',
    themes: ['taux IRCM', 'revenus occultes'],
    priority: 1,
    defines: ['taux IRCM'],
    valeurs: ['15%', '35%'],
  },

  'Art. 110A': {
    numero: 'Art. 110A',
    titre: 'Retenue IRCM',
    section: 'IRCM',
    themes: ['retenue source', 'paiement'],
    priority: 2,
  },

  // ========== IRF ==========
  'Art. 111': {
    numero: 'Art. 111',
    titre: 'Champ d\'application IRF',
    section: 'IRF',
    themes: ['IRF', 'revenus fonciers', 'loyers'],
    priority: 1,
    defines: ['impot revenus fonciers'],
  },

  'Art. 111A': {
    numero: 'Art. 111A',
    titre: 'Base imposable IRF',
    section: 'IRF',
    themes: ['base imposable', 'charges deductibles'],
    priority: 2,
  },

  'Art. 111B': {
    numero: 'Art. 111B',
    titre: 'Exonerations IRF',
    section: 'IRF',
    themes: ['exonerations', 'residence principale'],
    priority: 1,
    defines: ['exonerations IRF'],
    valeurs: ['5 ans'],
  },

  'Art. 111C': {
    numero: 'Art. 111C',
    titre: 'Cession terrain',
    section: 'IRF',
    themes: ['cession terrain', 'plus-values'],
    priority: 2,
  },

  'Art. 111D': {
    numero: 'Art. 111D',
    titre: 'Preponderance immobiliere',
    section: 'IRF',
    themes: ['preponderance immobiliere', 'cession titres'],
    priority: 2,
    valeurs: ['50%', '365 jours'],
  },

  'Art. 111E': {
    numero: 'Art. 111E',
    titre: 'Preponderance fonciere',
    section: 'IRF',
    themes: ['preponderance fonciere', 'CA'],
    priority: 3,
    valeurs: ['80%'],
  },

  'Art. 112': {
    numero: 'Art. 112',
    titre: 'Taux IRF',
    section: 'IRF',
    themes: ['taux IRF', 'loyers', 'plus-values'],
    priority: 1,
    defines: ['taux IRF'],
    valeurs: ['9%', '15%'],
  },

  'Art. 112A': {
    numero: 'Art. 112A',
    titre: 'Retenue source IRF',
    section: 'IRF',
    themes: ['retenue source', 'loyers'],
    priority: 1,
    valeurs: ['15 mars'],
  },

  'Art. 112B': {
    numero: 'Art. 112B',
    titre: 'Declaration IRF',
    section: 'IRF',
    themes: ['declaration', 'cession'],
    priority: 2,
    valeurs: ['60 jours'],
  },

  'Art. 113': {
    numero: 'Art. 113',
    titre: 'Fait generateur IRF',
    section: 'IRF',
    themes: ['fait generateur', 'bail'],
    priority: 2,
    valeurs: ['3 mois'],
  },

  'Art. 113A': {
    numero: 'Art. 113A',
    titre: 'Sous-location',
    section: 'IRF',
    themes: ['sous-location'],
    priority: 3,
  },

  // ========== ITS ==========
  'Art. 114': {
    numero: 'Art. 114',
    titre: 'Champ d\'application ITS',
    section: 'ITS',
    themes: ['ITS', 'salaires', 'traitements', 'pensions'],
    priority: 1,
    defines: ['impot traitements salaires'],
    valeurs: ['183 jours'],
  },

  'Art. 114A': {
    numero: 'Art. 114A',
    titre: 'Avantages en nature',
    section: 'ITS',
    themes: ['avantages en nature', 'logement', 'voiture', 'nourriture'],
    priority: 1,
    defines: ['avantages en nature'],
    valeurs: ['20% logement', '7% domesticite', '3% voiture', '20% nourriture', '5% eau', '2% telephone'],
  },

  'Art. 114B': {
    numero: 'Art. 114B',
    titre: 'Exonerations ITS',
    section: 'ITS',
    themes: ['exonerations', 'indemnites'],
    priority: 1,
    defines: ['exonerations ITS'],
  },

  'Art. 114C': {
    numero: 'Art. 114C',
    titre: 'Base imposable ITS',
    section: 'ITS',
    themes: ['base imposable', 'revenu net'],
    priority: 2,
  },

  'Art. 114D': {
    numero: 'Art. 114D',
    titre: 'Bareme ITS',
    section: 'ITS',
    themes: ['bareme', 'tranches', 'taux progressif'],
    priority: 1,
    defines: ['bareme ITS'],
    valeurs: ['1 200 FCFA', '10%', '15%', '20%', '30%'],
  },

  'Art. 114E': {
    numero: 'Art. 114E',
    titre: 'Charges de famille',
    section: 'ITS',
    themes: ['charges famille', 'quotient familial'],
    priority: 1,
    defines: ['charges famille ITS'],
  },

  'Art. 115': {
    numero: 'Art. 115',
    titre: 'Personnes imposables ITS',
    section: 'ITS',
    themes: ['personnes imposables', 'salaries'],
    priority: 2,
  },

  'Art. 116': {
    numero: 'Art. 116',
    titre: 'Retenue source ITS',
    section: 'ITS',
    themes: ['retenue source', 'employeur'],
    priority: 1,
    defines: ['retenue source ITS'],
  },

  'Art. 116A': {
    numero: 'Art. 116A',
    titre: 'Declaration ITS',
    section: 'ITS',
    themes: ['declaration', 'employeur'],
    priority: 2,
  },
};

/**
 * Articles prioritaires par theme
 */
export const PRIORITY_ARTICLES_IBA_2026: Record<string, string[]> = {
  'iba': ['Art. 93', 'Art. 94', 'Art. 95'],
  'forfait': ['Art. 96', 'Art. 96A', 'Art. 98'],
  'reel': ['Art. 102', 'Art. 103', 'Art. 104'],
  'ircm': ['Art. 105', 'Art. 110', 'Art. 105A'],
  'irf': ['Art. 111', 'Art. 112', 'Art. 111B'],
  'its': ['Art. 114', 'Art. 114D', 'Art. 114A', 'Art. 114E'],
  'taux': ['Art. 95', 'Art. 110', 'Art. 112', 'Art. 114D'],
};
