// server/src/config/article-metadata-dd.ts
// Métadonnées des articles - Chapitre 6 Dispositions diverses (CGI 2025)

export interface ArticleMetadataDD {
  numero: string;
  titre: string;
  section: number;
  section_titre: string;
  themes: string[];
  mots_cles: string[];
  valeurs_cles?: Record<string, string | number>;
  references_croisees?: string[];
  priority: number; // 1-5, 5 étant le plus important
  abroge?: boolean;
}

export const ARTICLE_METADATA_DD: ArticleMetadataDD[] = [
  // ==================== SECTION 1: OBLIGATIONS DES EMPLOYEURS (Art. 172-182) ====================
  {
    numero: 'Art. 172',
    titre: 'Retenue à la source par les employeurs et débirentiers',
    section: 1,
    section_titre: 'Obligations des employeurs et débirentiers',
    themes: ['retenue source', 'employeur', 'irpp', 'salaires'],
    mots_cles: ['retenue', 'employeur', 'débirentier', 'prélèvement', 'salaires', 'traitements', 'pensions', 'rentes viagères'],
    references_croisees: ['Art. 36', 'Art. 37', 'Art. 185 ter', 'Art. 126 quater B-1', 'Art. 183', 'Art. 39', 'Art. 174'],
    priority: 5,
  },
  {
    numero: 'Art. 173',
    titre: 'Versement des retenues à la recette des impôts',
    section: 1,
    section_titre: 'Obligations des employeurs et débirentiers',
    themes: ['versement', 'retenue', 'délais'],
    mots_cles: ['versement', '20 jours', 'mensuel', 'trimestriel', '5 personnes', 'recette impôts'],
    valeurs_cles: {
      delai_mensuel: '20 jours',
      seuil_trimestriel: '5 personnes',
    },
    references_croisees: ['Art. 172'],
    priority: 5,
  },
  {
    numero: 'Art. 174',
    titre: 'Livre de paie - Mentions obligatoires',
    section: 1,
    section_titre: 'Obligations des employeurs et débirentiers',
    themes: ['livre paie', 'obligations', 'conservation'],
    mots_cles: ['livre paie', 'avantages nature', 'bordereau', 'enfants charge', 'conservation', '4 ans'],
    valeurs_cles: {
      conservation: '4 ans',
    },
    references_croisees: ['Art. 171 bis', 'Art. 185'],
    priority: 4,
  },
  {
    numero: 'Art. 175',
    titre: 'Décès de l\'employeur - Versement retenues',
    section: 1,
    section_titre: 'Obligations des employeurs et débirentiers',
    themes: ['décès', 'employeur', 'versement'],
    mots_cles: ['décès', 'employeur', '15 jours', 'cessation'],
    valeurs_cles: {
      delai_deces: '15 premiers jours du mois suivant',
    },
    priority: 3,
  },
  {
    numero: 'Art. 176',
    titre: 'État annuel des salaires',
    section: 1,
    section_titre: 'Obligations des employeurs et débirentiers',
    themes: ['état annuel', 'déclaration', 'salaires'],
    mots_cles: ['état annuel', 'janvier', '120 000 FCFA', 'nominatif', 'NIU', 'récapitulatif'],
    valeurs_cles: {
      delai: 'janvier',
      seuil_nominatif: '120 000 FCFA',
    },
    references_croisees: ['Art. 39'],
    priority: 5,
  },
  {
    numero: 'Art. 177',
    titre: 'Déclaration mensuelle - Plus de 3 personnes',
    section: 1,
    section_titre: 'Obligations des employeurs et débirentiers',
    themes: ['déclaration mensuelle', 'seuil personnel'],
    mots_cles: ['3 personnes', 'mensuelle', 'déclaration'],
    valeurs_cles: {
      seuil_personnel: 'plus de 3 personnes',
    },
    references_croisees: ['Art. 176'],
    priority: 4,
  },
  {
    numero: 'Art. 177 bis',
    titre: 'Fiche individuelle des salariés',
    section: 1,
    section_titre: 'Obligations des employeurs et débirentiers',
    themes: ['fiche individuelle', 'salarié'],
    mots_cles: ['fiche individuelle', 'salarié', 'employé'],
    references_croisees: ['Art. 176'],
    priority: 3,
  },
  {
    numero: 'Art. 178',
    titre: 'État annuel en cas de cession, cessation ou décès',
    section: 1,
    section_titre: 'Obligations des employeurs et débirentiers',
    themes: ['cession', 'cessation', 'décès', 'état annuel'],
    mots_cles: ['cession', 'cessation', 'décès', '6 mois', '31 janvier'],
    valeurs_cles: {
      delai_deces: '6 mois (max 31 janvier suivant)',
    },
    references_croisees: ['Art. 176'],
    priority: 3,
  },
  {
    numero: 'Art. 179',
    titre: 'Déclaration des rémunérations diverses',
    section: 1,
    section_titre: 'Obligations des employeurs et débirentiers',
    themes: ['rémunérations diverses', 'jetons présence', 'tantièmes'],
    mots_cles: ['jetons présence', 'tantièmes', 'allocations forfaitaires', 'remboursement frais', '5 000 FCFA'],
    valeurs_cles: {
      seuil: '5 000 FCFA/an',
    },
    references_croisees: ['Art. 14', 'Art. 15', 'Art. 42', 'Art. 107'],
    priority: 4,
  },
  {
    numero: 'Art. 180',
    titre: 'État global des rémunérations diverses',
    section: 1,
    section_titre: 'Obligations des employeurs et débirentiers',
    themes: ['état global', 'récapitulatif'],
    mots_cles: ['état global', 'janvier', 'montant global'],
    references_croisees: ['Art. 176'],
    priority: 3,
  },
  {
    numero: 'Art. 181',
    titre: 'Régularisation en cas de cession ou cessation',
    section: 1,
    section_titre: 'Obligations des employeurs et débirentiers',
    themes: ['régularisation', 'cession', 'cessation'],
    mots_cles: ['régularisation', 'cession', 'cessation', '10 jours', 'trop perçu'],
    valeurs_cles: {
      delai: '10 jours',
    },
    references_croisees: ['Art. 176'],
    priority: 3,
  },
  {
    numero: 'Art. 182',
    titre: 'Réclamation du salarié - Trop perçu',
    section: 1,
    section_titre: 'Obligations des employeurs et débirentiers',
    themes: ['réclamation', 'restitution', 'trop perçu'],
    mots_cles: ['réclamation', '1er avril', 'trop perçu', 'restitution'],
    valeurs_cles: {
      delai_reclamation: 'avant le 1er avril',
    },
    references_croisees: ['Art. 382'],
    priority: 3,
  },

  // ==================== SECTION 2: COMMISSIONS 10% (Art. 183-183 ter) ====================
  {
    numero: 'Art. 183',
    titre: 'Retenue 10% sur commissions, honoraires, droits d\'auteur',
    section: 2,
    section_titre: 'Obligations des personnes versant commissions, courtages, ristournes, honoraires et droits d\'auteurs',
    themes: ['retenue 10%', 'commissions', 'honoraires', 'sanctions'],
    mots_cles: ['10%', 'commissions', 'courtages', 'ristournes', 'honoraires', 'droits auteur', 'vacations', 'gratifications', 'amende', 'intérêt 5%'],
    valeurs_cles: {
      taux: '10%',
      sanction_defaut_retenue: 'amende égale au prélèvement',
      sanction_defaut_reversement: 'amende + intérêt 5%/mois',
    },
    references_croisees: ['Art. 76-80', 'Art. 173-176', 'Art. 379'],
    priority: 5,
  },
  {
    numero: 'Art. 183 bis',
    titre: 'Droits d\'auteur sur spectacles et manifestations',
    section: 2,
    section_titre: 'Obligations des personnes versant commissions, courtages, ristournes, honoraires et droits d\'auteurs',
    themes: ['droits auteur', 'spectacles', 'artistes'],
    mots_cles: ['spectacles', 'manifestations', 'représentations', 'artistes', 'auteurs', 'compositeurs', '15 jours', '5 000 FCFA'],
    valeurs_cles: {
      delai: '15 jours',
      seuil: '5 000 FCFA/an',
    },
    references_croisees: ['Art. 47'],
    priority: 4,
  },
  {
    numero: 'Art. 183 ter',
    titre: 'Commissionnaires en douane - Déclaration',
    section: 2,
    section_titre: 'Obligations des personnes versant commissions, courtages, ristournes, honoraires et droits d\'auteurs',
    themes: ['commissionnaires douane', 'transitaires', 'sanctions'],
    mots_cles: ['commissionnaires douanes', 'transitaires', 'avant 15', '500 000 FCFA', 'amende'],
    valeurs_cles: {
      delai: 'avant le 15 du mois suivant',
      amende: '500 000 FCFA',
    },
    priority: 4,
  },

  // ==================== SECTION 3: SNC (Art. 184) ====================
  {
    numero: 'Art. 184',
    titre: 'Déclaration de répartition des bénéfices - SNC',
    section: 3,
    section_titre: 'Déclaration des rémunérations d\'associés et parts de bénéfices',
    themes: ['snc', 'commandite simple', 'répartition bénéfices'],
    mots_cles: ['snc', 'société nom collectif', 'commandite simple', 'associés gérants', 'répartition bénéfices', 'parts bénéfices'],
    priority: 4,
  },

  // ==================== SECTION 4: SOURCE ÉTRANGÈRE (Art. 185) ====================
  {
    numero: 'Art. 185',
    titre: 'Renseignements sur revenus de source étrangère',
    section: 4,
    section_titre: 'Renseignements à fournir par les bénéficiaires de revenus de source étrangère',
    themes: ['source étrangère', 'revenus étrangers'],
    mots_cles: ['source étrangère', 'revenus étrangers', 'pensions étrangères', 'salaires étrangers'],
    priority: 3,
  },

  // ==================== SECTION 5: SOCIÉTÉS 126 TER (Art. 185 bis) ====================
  {
    numero: 'Art. 185 bis',
    titre: 'Obligations des sociétés étrangères visées à l\'article 126 ter',
    section: 5,
    section_titre: 'Dispositions particulières applicables aux sociétés visées à l\'article 126 ter',
    themes: ['sociétés étrangères', 'sous-traitants pétroliers', '126 ter'],
    mots_cles: ['126 ter', 'sociétés étrangères', 'sous-traitants pétroliers', 'prestataires pétroliers', 'liste salariés'],
    references_croisees: ['Art. 126 ter', 'Art. 172', 'Art. 75'],
    priority: 4,
  },

  // ==================== SECTION 6: NON-RÉSIDENTS (Art. 185 ter) ====================
  {
    numero: 'Art. 185 ter-A',
    titre: 'Champ d\'application - Retenue sur non-résidents',
    section: 6,
    section_titre: 'Dispositions particulières applicables aux non-résidents',
    themes: ['non-résidents', 'champ application', 'redevances'],
    mots_cles: ['non-résidents', 'redevances', 'royalties', 'brevets', 'marques', 'procédés secrets', 'assistance technique', 'assistance financière', 'assistance comptable', 'location équipements', 'trading', 'propriété intellectuelle'],
    references_croisees: ['Art. 185 ter'],
    priority: 5,
  },
  {
    numero: 'Art. 185 ter-B',
    titre: 'Débiteur résident - Obligation de retenue',
    section: 6,
    section_titre: 'Dispositions particulières applicables aux non-résidents',
    themes: ['débiteur résident', 'obligation retenue'],
    mots_cles: ['débiteur résident', 'payeur résident', 'obligation retenue'],
    priority: 4,
  },
  {
    numero: 'Art. 185 ter-C',
    titre: 'Taux de retenue sur non-résidents',
    section: 6,
    section_titre: 'Dispositions particulières applicables aux non-résidents',
    themes: ['taux retenue', 'non-résidents', '20%', '10%', '5,75%', '5%'],
    mots_cles: ['20%', '10%', '5,75%', '5%', 'cemac', 'zone angola', 'affrètement', 'navires', 'aéronefs', 'intérêts emprunts', 'pétroliers', 'streaming', 'audiovisuel'],
    valeurs_cles: {
      taux_general: '20%',
      taux_moyen: '10%',
      taux_reduit: '5,75%',
      taux_specifique: '5%',
    },
    references_croisees: ['Art. 185 ter-A'],
    priority: 5,
  },
  {
    numero: 'Art. 185 ter-D',
    titre: 'Imputation de la retenue',
    section: 6,
    section_titre: 'Dispositions particulières applicables aux non-résidents',
    themes: ['imputation', 'crédit impôt'],
    mots_cles: ['imputation', 'crédit impôt', 'déduction retenue'],
    priority: 3,
  },
  {
    numero: 'Art. 185 ter-E',
    titre: 'Procédure de versement',
    section: 6,
    section_titre: 'Dispositions particulières applicables aux non-résidents',
    themes: ['procédure', 'versement', 'modalités'],
    mots_cles: ['procédure versement', 'modalités'],
    references_croisees: ['Art. 185 ter-A'],
    priority: 4,
  },
  {
    numero: 'Art. 185 ter-F',
    titre: 'Exclusions du régime de retenue',
    section: 6,
    section_titre: 'Dispositions particulières applicables aux non-résidents',
    themes: ['exclusions', 'exonérations', 'dérogations'],
    mots_cles: ['exclusions', 'exonération', 'dérogation'],
    priority: 3,
  },
  {
    numero: 'Art. 185 quater',
    titre: 'Article abrogé',
    section: 6,
    section_titre: 'Dispositions particulières applicables aux non-résidents',
    themes: [],
    mots_cles: [],
    abroge: true,
    priority: 0,
  },
];

/**
 * Articles prioritaires pour le chapitre 6
 */
export const PRIORITY_ARTICLES_DD = [
  'Art. 172',     // Retenue employeurs - fondamental
  'Art. 173',     // Versement retenues - délais importants
  'Art. 176',     // État annuel salaires - obligation majeure
  'Art. 183',     // Retenue 10% commissions - très fréquent
  'Art. 185 ter-A', // Non-résidents champ - essentiel
  'Art. 185 ter-C', // Taux non-résidents - très demandé
];

/**
 * Récupère les métadonnées d'un article DD
 */
export function getArticleMetadataDD(numero: string): ArticleMetadataDD | undefined {
  return ARTICLE_METADATA_DD.find(
    a => a.numero === numero || a.numero === `Art. ${numero}` || numero === `Art. ${a.numero.replace('Art. ', '')}`
  );
}

/**
 * Récupère les articles par section
 */
export function getArticlesBySection(section: number): ArticleMetadataDD[] {
  return ARTICLE_METADATA_DD.filter(a => a.section === section && !a.abroge);
}

/**
 * Récupère les articles par thème
 */
export function getArticlesByTheme(theme: string): ArticleMetadataDD[] {
  const themeLower = theme.toLowerCase();
  return ARTICLE_METADATA_DD.filter(
    a => a.themes.some(t => t.toLowerCase().includes(themeLower)) && !a.abroge
  );
}
