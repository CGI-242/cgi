/**
 * Mapping des mots-cles vers les articles du CGI 2025
 * Chapitre 4 - Dispositions Communes (Art. 127 a 140 bis)
 *
 * REGLE : Le premier article de chaque liste est la SOURCE PRIMAIRE
 *
 * @author NORMX AI - CGI 242
 * @version 2025
 */

export const KEYWORD_ARTICLE_MAP_DC: Record<string, string[]> = {

  // ========== REVISION DES BILANS ==========
  'revision bilans': ['Art. 127'],
  'reevaluation': ['Art. 127'],
  'reevaluation bilans': ['Art. 127'],
  'plus-values reevaluation': ['Art. 127'],
  '31 decembre 1964': ['Art. 127'],

  // ========== REGIMES DEROGATOIRES ==========
  'regimes derogatoires': ['Art. 127 quinquies'],
  'cpp': ['Art. 127 quinquies'],
  'contrat partage production': ['Art. 127 quinquies'],
  'convention etablissement': ['Art. 127 quinquies'],
  'regime privilegie': ['Art. 127 quinquies'],
  '1er janvier 2021': ['Art. 127 quinquies'],
  'non cumul regimes': ['Art. 127 quinquies'],

  // ========== PROVISIONS MINIERES - PRINCIPE ==========
  'provision reconstitution gisements': ['Art. 133'],
  'prg': ['Art. 133'],
  'provision miniere': ['Art. 133'],
  'provision petroliere': ['Art. 133', 'Art. 134'],
  'franchise impot': ['Art. 133'],
  'substances minerales concessibles': ['Art. 133'],

  // ========== HYDROCARBURES - LIMITES ET CALCUL ==========
  'hydrocarbures': ['Art. 134'],
  'petrole': ['Art. 134'],
  'gaz naturel': ['Art. 134'],
  'petrole brut': ['Art. 134'],
  '27,5%': ['Art. 134'],
  '27.5%': ['Art. 134'],
  '27,50%': ['Art. 134'],
  '50% benefice': ['Art. 134'],
  'ventes produits marchands': ['Art. 134'],
  'benefice net imposable hydrocarbures': ['Art. 134'],
  'deficit hydrocarbures': ['Art. 134'],
  '5 exercices deficit': ['Art. 134'],
  'report deficit hydrocarbures': ['Art. 134'],
  'redevances minieres': ['Art. 134'],
  'subventions production': ['Art. 134'],

  // ========== HYDROCARBURES - INSCRIPTION BILAN ==========
  'inscription bilan provision': ['Art. 135'],
  'passif bilan provision': ['Art. 135'],
  'rubrique speciale provision': ['Art. 135'],
  'dotations exercice': ['Art. 135'],

  // ========== HYDROCARBURES - UTILISATION ==========
  'utilisation provision': ['Art. 136'],
  'delai 5 ans provision': ['Art. 136'],
  'emplois autorises provision': ['Art. 136'],
  'travaux recherche hydrocarbures': ['Art. 136'],
  'immobilisations recherche': ['Art. 136'],
  'participations societes recherche': ['Art. 136'],
  'gisement reconnu': ['Art. 136'],
  'titre exploitation': ['Art. 136'],

  // ========== HYDROCARBURES - REMPLOI ==========
  'remploi conforme': ['Art. 137'],
  'exoneration definitive': ['Art. 137'],
  'virement reserve': ['Art. 137'],
  'defaut remploi': ['Art. 137'],
  'imposition complementaire': ['Art. 137'],
  'sanction provision': ['Art. 137'],

  // ========== HYDROCARBURES - CESSION/DECES ==========
  'cession entreprise provision': ['Art. 138'],
  'cessation activite provision': ['Art. 138'],
  'fusion provision': ['Art. 138'],
  'deces exploitant provision': ['Art. 138'],
  'heritiers provision': ['Art. 138'],
  'continuation exploitation': ['Art. 138'],
  'societe absorbante': ['Art. 138'],

  // ========== HYDROCARBURES - OBLIGATIONS ==========
  'obligations declaratives hydrocarbures': ['Art. 139'],
  'renseignements provision': ['Art. 139'],
  'declaration resultats hydrocarbures': ['Art. 139'],

  // ========== SUBSTANCES MINERALES ==========
  'substances minerales': ['Art. 140'],
  'minerais': ['Art. 140'],
  'mines': ['Art. 140'],
  'metaux': ['Art. 140'],
  'or': ['Art. 140'],
  'fer': ['Art. 140'],
  'cuivre': ['Art. 140'],
  'mattes': ['Art. 140'],
  'speiss': ['Art. 140'],
  'alliages': ['Art. 140'],
  '15% provision': ['Art. 140'],
  'provision 15%': ['Art. 140'],
  'gisements existants': ['Art. 140'],
  'mise en exploitation': ['Art. 140'],
  'amelioration recuperation': ['Art. 140'],

  // ========== NON-CUMUL ==========
  'non cumul provisions': ['Art. 140 bis'],
  'reductions investissement': ['Art. 140 bis'],
  'cumul avantages': ['Art. 140 bis'],
};

/**
 * Synonymes pour expansion de requetes CGI 2025 Chapitre 4
 */
export const SYNONYMS_DC: Record<string, string[]> = {
  'provision reconstitution gisements': ['PRG', 'provision miniere', 'provision petroliere', 'dotation gisements'],
  'hydrocarbures': ['petrole', 'gaz naturel', 'huile', 'brut', 'ressources petrolieres'],
  'substances minerales': ['minerais', 'mines', 'metaux', 'extraction miniere'],
  'gisement': ['gite', 'reserves', 'ressources', 'depot'],
  'cpp': ['contrat de partage de production', 'contrat petrolier'],
  'reevaluation': ['revision bilans', 'plus-values reevaluation', 'actualisation'],
  'remploi': ['utilisation provision', 'affectation provision', 'emploi provision'],
};
