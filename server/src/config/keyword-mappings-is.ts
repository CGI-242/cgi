/**
 * Mapping des mots-cles vers les articles du CGI 2025
 * Chapitre 3 - Impot sur les benefices des societes (Art. 106 a 126 septies)
 *
 * REGLE : Le premier article de chaque liste est la SOURCE PRIMAIRE
 *
 * @author NORMX AI - CGI 242
 * @version 2025
 */

export const KEYWORD_ARTICLE_MAP_IS: Record<string, string[]> = {

  // ========== GENERALITES - TAUX IS ==========
  'taux is': ['Art. 122'],
  'taux impot societes': ['Art. 122'],
  '30%': ['Art. 122'],
  '25%': ['Art. 122-A'],
  '28%': ['Art. 122-A'],
  '33%': ['Art. 122-A'],
  'taux normal is': ['Art. 122'],
  'taux reduit is': ['Art. 122-A'],
  'taux microfinance': ['Art. 122-A'],
  'taux mines': ['Art. 122-A'],
  'taux immobilier': ['Art. 122-A'],

  // ========== ART. 106 - PRINCIPE IS ==========
  'principe is': ['Art. 106'],
  'definition is': ['Art. 106'],

  // ========== ART. 107 - PERSONNES IMPOSABLES ==========
  'personnes imposables is': ['Art. 107'],
  'societes de capitaux': ['Art. 107'],
  'sa': ['Art. 107'],
  'sarl': ['Art. 107'],
  'option is': ['Art. 107'],
  'snc option': ['Art. 107'],

  // ========== ART. 107-A - EXONERATIONS ==========
  'exonerations is': ['Art. 107-A'],
  'cooperatives agricoles': ['Art. 107-A'],
  'gie exonere': ['Art. 107-A'],
  'beac exonere': ['Art. 107-A'],
  'collectivites locales': ['Art. 107-A'],

  // ========== ART. 108 - TERRITORIALITE ==========
  'territorialite is': ['Art. 108'],
  'etablissement stable': ['Art. 108'],
  'cycle commercial': ['Art. 108'],

  // ========== ART. 109 - BENEFICE IMPOSABLE ==========
  'benefice imposable': ['Art. 109'],
  'benefice net': ['Art. 109'],
  'actif net': ['Art. 109-A'],
  'charges deductibles': ['Art. 109-B'],
  'acte anormal gestion': ['Art. 109-B'],
  'microfinance is': ['Art. 109-C'],

  // ========== ART. 110 - CHARGES PERSONNEL ==========
  'charges personnel': ['Art. 110'],
  'remunerations': ['Art. 110'],
  'salaires deductibles': ['Art. 110'],
  'gerants majoritaires': ['Art. 110-A'],
  'cotisations retraite': ['Art. 110-B'],
  '15% cotisations': ['Art. 110-B'],
  'frais transport personnel': ['Art. 110-F', 'Art. 110-G'],

  // ========== ART. 111 - REMUNERATIONS ETRANGER ==========
  'frais de siege': ['Art. 111'],
  '20% frais siege': ['Art. 111'],
  'remunerations etranger': ['Art. 111'],
  '2% btp': ['Art. 111-A'],
  'redevances': ['Art. 111-A bis'],
  'brevets': ['Art. 111-A bis'],
  'commissions': ['Art. 111-B'],
  '5% commissions': ['Art. 111-B'],

  // ========== ART. 112 - AUTRES FRAIS ==========
  'locations': ['Art. 112'],
  'credit-bail': ['Art. 112-A'],
  'leasing': ['Art. 112-A'],
  'impots deductibles': ['Art. 112-B'],
  'primes assurance': ['Art. 112-C'],
  'frais financiers': ['Art. 112-D'],
  'interets associes': ['Art. 112-E'],
  'taux beac': ['Art. 112-E'],
  'interets deductibles': ['Art. 112-F'],

  // ========== ART. 113 - CHARGES NON DEDUCTIBLES ==========
  'dons': ['Art. 113'],
  'liberalites': ['Art. 113'],
  '0,5 pour mille': ['Art. 113'],
  '500 000 fcfa': ['Art. 113-A'],
  'sfec': ['Art. 113-A', 'Art. 114-J bis'],
  'depenses somptuaires': ['Art. 113-B'],
  'amendes non deductibles': ['Art. 113-C'],
  'covid-19': ['Art. 113 bis'],

  // ========== ART. 114 - AMORTISSEMENTS ==========
  'amortissements': ['Art. 114'],
  'taux amortissement': ['Art. 114-A'],
  'amortissement lineaire': ['Art. 114-B'],
  'amortissement degressif': ['Art. 114-C'],
  'credit-bail amortissement': ['Art. 114-D', 'Art. 114-E'],
  'amortissement accelere': ['Art. 114-F'],
  '40% accelere': ['Art. 114-F'],
  '400 millions': ['Art. 114-F'],
  'vehicules tourisme': ['Art. 114-G'],
  '40 millions vehicule': ['Art. 114-G'],
  '500 000 amortissement': ['Art. 114-H'],
  'amortissement 100%': ['Art. 114-I', 'Art. 114-J bis'],

  // ========== ART. 115 - PROVISIONS ==========
  'provisions': ['Art. 115'],
  'creances douteuses': ['Art. 115-A'],
  'cobac': ['Art. 115-B'],
  'provisions titres': ['Art. 115-C'],
  'conges payes': ['Art. 115-D'],
  'provisions risques': ['Art. 115-E'],

  // ========== ART. 116 - PRODUITS TAXABLES ==========
  'produits imposables': ['Art. 116'],
  'ventes imposables': ['Art. 116'],
  'cessions actif': ['Art. 116-A'],
  'degrevements': ['Art. 116-B'],
  'ecarts conversion': ['Art. 116-C'],

  // ========== ART. 117 - STOCKS ==========
  'stocks': ['Art. 117'],
  'peps': ['Art. 117'],
  'fifo': ['Art. 117'],
  'cout moyen pondere': ['Art. 117'],
  'travaux en cours': ['Art. 117-A'],

  // ========== ART. 118 - PLUS-VALUES ==========
  'plus-values': ['Art. 118'],
  'moins-values': ['Art. 118'],
  'reinvestissement': ['Art. 118-A'],
  '3 ans remploi': ['Art. 118-A'],
  'fusions': ['Art. 118-B'],
  'scissions': ['Art. 118-B'],
  'cessation activite': ['Art. 118-C'],
  'societes petrolieres pv': ['Art. 118-D'],
  '10% plus-values': ['Art. 118-E'],

  // ========== ART. 119 - REPORT DEFICITS ==========
  'report deficits': ['Art. 119'],
  'deficits reportables': ['Art. 119'],
  '3 ans deficit': ['Art. 119'],
  'pertes reportables': ['Art. 119'],

  // ========== ART. 120 - PRIX DE TRANSFERT ==========
  'prix de transfert': ['Art. 120'],
  'prix transfert': ['Art. 120'],
  'parties liees': ['Art. 120'],
  'entreprises liees': ['Art. 120'],
  'documentation prix transfert': ['Art. 120-A'],
  '500 millions pt': ['Art. 120-A'],
  'methodes prix transfert': ['Art. 120-B'],
  'pcml': ['Art. 120-B'],
  'prm': ['Art. 120-B'],
  'mtmn': ['Art. 120-B'],
  'ocde': ['Art. 120-B'],
  'app': ['Art. 120-C'],
  'accord prealable prix': ['Art. 120-C'],
  'sanctions prix transfert': ['Art. 120-D'],
  '5 000 000 amende pt': ['Art. 120-D'],
  '25 000 000 amende pt': ['Art. 120-D'],
  'declaration pays par pays': ['Art. 120-E', 'Art. 120-F', 'Art. 120-G', 'Art. 120-H'],

  // ========== ART. 121 - PERIODE IMPOSITION ==========
  'exercice comptable': ['Art. 121'],
  '12 mois': ['Art. 121'],
  'premier bilan': ['Art. 121'],

  // ========== ART. 122 - CALCUL IMPOT ==========
  'calcul is': ['Art. 122'],
  'irvm imputation': ['Art. 122-B'],

  // ========== ART. 123 - ETABLISSEMENT IMPOT ==========
  'etablissement is': ['Art. 123'],
  'bica': ['Art. 123'],
  'dissolution': ['Art. 123'],
  'fusion is': ['Art. 123'],

  // ========== ART. 124 - OBLIGATIONS ==========
  'declaration existence': ['Art. 124'],
  'declaration resultats': ['Art. 124-A'],
  '4 mois declaration': ['Art. 124-A'],
  'acomptes is': ['Art. 124-B'],
  '15 fevrier': ['Art. 124-B'],
  '15 mai': ['Art. 124-B'],
  '15 aout': ['Art. 124-B'],
  '15 novembre': ['Art. 124-B'],
  'cessation activites': ['Art. 124-C'],

  // ========== ART. 125 - SOCIETES NOUVELLES ==========
  'societes nouvelles': ['Art. 125'],

  // ========== ART. 126 - REGIME MERE-FILLE ==========
  'societes meres': ['Art. 126'],
  'filiales': ['Art. 126'],
  'dividendes mere-fille': ['Art. 126'],
  '25% participation': ['Art. 126'],
  'quote-part 10%': ['Art. 126'],
  '2 ans conservation': ['Art. 126'],
  'subventions intragroupe': ['Art. 126-A'],
  'abandons creances': ['Art. 126-A'],

  // ========== ART. 126-B - SUCCURSALES ==========
  'succursales': ['Art. 126-B'],
  'agences': ['Art. 126-B'],

  // ========== ART. 126-C - QUARTIERS GENERAUX ==========
  'quartiers generaux': ['Art. 126-C-1'],
  'qg cemac': ['Art. 126-C-1'],
  'base forfaitaire qg': ['Art. 126-C-2'],
  'autorisation prealable qg': ['Art. 126-C-3'],

  // ========== ART. 126-D - HOLDINGS ==========
  'holdings': ['Art. 126-D'],
  'societe holding': ['Art. 126-D'],
  'deux tiers actif': ['Art. 126-D'],
  '5 ans holding': ['Art. 126-D-1'],
  'regime holding': ['Art. 126-D-2', 'Art. 126-D-3'],
  'plus-values holding': ['Art. 126-D-4'],
  'irvm holding': ['Art. 126-D-5'],

  // ========== ART. 126-E - INTEGRATION FISCALE ==========
  'integration fiscale': ['Art. 126-E'],
  'groupe fiscal': ['Art. 126-E'],
  '95% participation': ['Art. 126-E'],
  'resultat ensemble': ['Art. 126-E-1'],
  'neutralisation': ['Art. 126-E-2'],
  'option integration': ['Art. 126-E-3'],
  '5 exercices': ['Art. 126-E-3'],
  'sortie groupe': ['Art. 126-E-5'],

  // ========== ART. 126 BIS ET SUIVANTS - PERSONNES MORALES ETRANGERES ==========
  'personnes morales etrangeres': ['Art. 126 bis', 'Art. 126 ter'],
  'non residents is': ['Art. 126 ter'],
  'forfaitaire 22%': ['Art. 126 ter'],
  'sous-traitants petroliers': ['Art. 126 ter A', 'Art. 126 quater B-1'],
  'ate': ['Art. 126 quater C-1'],
  'autorisation temporaire exercer': ['Art. 126 quater C-1'],
  'quitus fiscal': ['Art. 126 quater D'],
  '100 milliards quitus': ['Art. 126 quater D'],
  'zone angola': ['Art. 126 septies'],
  '5.75%': ['Art. 126 septies'],
  '70% petrole': ['Art. 126 sexies'],
};

/**
 * Synonymes pour expansion de requetes CGI 2025 IS
 */
export const SYNONYMS_IS: Record<string, string[]> = {
  'is': ['impot sur les societes', 'impot sur les benefices', 'corporate tax'],
  'etablissement stable': ['es', 'succursale', 'presence permanente'],
  'prix de transfert': ['pt', 'transfer pricing', 'transactions intragroupe'],
  'regime mere-fille': ['dividendes intragroupe', 'participation qualifiee'],
  'integration fiscale': ['groupe fiscal', 'consolidation fiscale', 'resultat d\'ensemble'],
  'holding': ['societe de participation', 'societe portefeuille'],
  'credit-bail': ['leasing', 'location financiere', 'loa'],
  'amortissement': ['dotation aux amortissements', 'depreciation'],
  'provisions': ['dotation aux provisions', 'charges a venir'],
  'deficit reportable': ['report deficitaire', 'pertes reportables'],
  'redevances': ['royalties', 'droits auteur', 'licences'],
  'sous-traitant petrolier': ['contractor', 'prestataire petrolier'],
  'bica': ['benefices industriels et commerciaux artisanaux', 'regime reel'],
};
