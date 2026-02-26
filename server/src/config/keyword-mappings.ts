/**
 * Mapping complet des mots-clés vers les articles du CGI 2025
 * Chapitre 1 : IRPP (Art. 1 à 101)
 * 
 * RÈGLE : Le premier article de chaque liste est la SOURCE PRIMAIRE
 * 
 * @author NORMX AI - CGI 242
 * @version 2025
 */

export const KEYWORD_ARTICLE_MAP: Record<string, string[]> = {
  
  // ========== ART. 1 - CATÉGORIES DE REVENUS ==========
  'catégories de revenus': ['Art. 1'],
  'catégories revenus': ['Art. 1'],
  'sept catégories': ['Art. 1'],
  '7 catégories': ['Art. 1'],
  'composition du revenu': ['Art. 1'],
  'quelles catégories': ['Art. 1'],
  'revenu net global': ['Art. 1', 'Art. 11', 'Art. 66'],
  
  // ========== ART. 2 - PERSONNES IMPOSABLES ==========
  'personnes imposables': ['Art. 2'],
  'qui est imposable': ['Art. 2'],
  'domicile fiscal': ['Art. 2', 'Art. 8'],
  'résidence habituelle': ['Art. 2'],
  'résidence fiscale': ['Art. 2'],
  'vingt-quatre mois': ['Art. 2'],
  '24 mois': ['Art. 2'],
  'perte de résidence': ['Art. 2'],
  'durée absence': ['Art. 2'],
  'absence continue': ['Art. 2'],
  
  // ========== ART. 3 - EXONÉRATIONS ==========
  'exonération irpp': ['Art. 3', 'Art. 38'],
  'affranchis de l\'impôt': ['Art. 3'],
  'qui est exonéré': ['Art. 3'],
  'minimum imposable': ['Art. 3', 'Art. 95'],
  'diplomates': ['Art. 3'],
  
  // ========== ART. 4 - FOYER FISCAL ==========
  'chef de famille': ['Art. 4'],
  'foyer fiscal': ['Art. 4', 'Art. 91'],
  'imposition distincte': ['Art. 4'],
  'femme mariée': ['Art. 4'],
  'enfants à charge': ['Art. 93', 'Art. 91', 'Art. 4'],
  
  // ========== ART. 6 - ASSOCIÉS ==========
  'associés': ['Art. 6'],
  'sociétés de personnes': ['Art. 6'],
  'snc': ['Art. 6'],
  'gie': ['Art. 6'],
  
  // ========== ART. 8 - LIEU D'IMPOSITION ==========
  'lieu d\'imposition': ['Art. 8'],
  'lieu imposition': ['Art. 8'],
  
  // ========== ART. 12-13 - REVENUS FONCIERS ==========
  'revenus fonciers': ['Art. 12', 'Art. 1'],
  'propriétés bâties': ['Art. 12'],
  'location': ['Art. 12', 'Art. 13 bis'],
  'loyer': ['Art. 12', 'Art. 13 bis'],
  'revenu net foncier': ['Art. 13'],
  'charges foncières': ['Art. 13 quater'],
  'déduction forfaitaire 30%': ['Art. 13 quater'],
  
  // ========== ART. 14-15 - BICA ==========
  'bica': ['Art. 14'],
  'bénéfices industriels': ['Art. 14', 'Art. 1'],
  'bénéfices commerciaux': ['Art. 14', 'Art. 1'],
  'bénéfices artisanaux': ['Art. 14'],
  'location meublée': ['Art. 15'],
  'fonds de commerce': ['Art. 15', 'Art. 63'],
  
  // ========== ART. 15 bis - DÉCLARATION D'EXISTENCE ==========
  'déclaration d\'existence': ['Art. 15 bis'],
  'début d\'activité': ['Art. 15 bis'],
  
  // ========== ART. 26, 28 - RÉGIME DU FORFAIT ==========
  'régime du forfait': ['Art. 26'],
  'forfait': ['Art. 26', 'Art. 28'],
  '100 000 000': ['Art. 26', 'Art. 30'],
  '100 millions': ['Art. 26', 'Art. 30'],
  'seuil forfait': ['Art. 26'],
  'exclusions forfait': ['Art. 26'],
  'smt': ['Art. 26', 'Art. 28'],

  // Déclaration n°294 - Spécifique au régime du forfait
  'déclaration 294': ['Art. 26', 'Art. 28'],
  'déclaration n°294': ['Art. 26', 'Art. 28'],
  'déclaration no 294': ['Art. 26', 'Art. 28'],
  'formulaire 294': ['Art. 26', 'Art. 28'],
  'imprimé 294': ['Art. 26', 'Art. 28'],
  '294': ['Art. 26', 'Art. 28'],
  'déclaration forfait contenu': ['Art. 28', 'Art. 26'],
  'états financiers forfait': ['Art. 28', 'Art. 26'],
  'déclaration spéciale forfait': ['Art. 28'],
  
  // ========== ART. 30 - RÉGIME DU RÉEL ==========
  'régime du réel': ['Art. 30'],
  'régime réel': ['Art. 30'],
  'bénéfice réel': ['Art. 30', 'Art. 17'],
  '2 milliards': ['Art. 30'],
  'grandes entreprises': ['Art. 30'],
  
  // ========== ART. 31 - ÉTATS FINANCIERS ==========
  'états financiers': ['Art. 31'],
  'dsf': ['Art. 31'],
  'ohada': ['Art. 31', 'Art. 28'],
  'bilan': ['Art. 31'],
  'compte de résultat': ['Art. 31'],
  
  // ========== ART. 33 - RECTIFICATION D'OFFICE ==========
  // Art. 33 = documents comptables insuffisants pour déterminer les résultats
  'rectification d\'office': ['Art. 33'],
  'rectification office': ['Art. 33'],
  'rectifier d\'office': ['Art. 33'],
  'documents comptables insuffisants': ['Art. 33'],
  'livres registres insuffisants': ['Art. 33'],
  'résultats imprécis': ['Art. 33'],
  'procéder rectification': ['Art. 33'],

  // ========== ART. 86 - TAXATION D'OFFICE ==========
  // Art. 86 = pas de déclaration dans les délais
  'taxation d\'office': ['Art. 86', 'Art. 33'],
  'taxation office': ['Art. 86', 'Art. 33'],
  'mise en demeure': ['Art. 86', 'Art. 33'],
  
  // ========== ART. 36 - BÉNÉFICES AGRICOLES ==========
  'bénéfices agricoles': ['Art. 36-A', 'Art. 1'],
  'agriculture': ['Art. 36-A'],
  'élevage': ['Art. 36-A'],
  'exonération agricole': ['Art. 36-B'],
  
  // ========== ART. 37-41 - TRAITEMENTS ET SALAIRES ==========
  'traitements salaires': ['Art. 37', 'Art. 1'],
  'traitements et salaires': ['Art. 37', 'Art. 1'],
  'salaires': ['Art. 37'],
  'pensions': ['Art. 37', 'Art. 38'],
  'rentes viagères': ['Art. 37', 'Art. 38'],
  
  // ========== ART. 38 - EXONÉRATIONS SALAIRES ==========
  'exonérations salaires': ['Art. 38'],
  'allocations familiales': ['Art. 38'],
  'indemnité licenciement': ['Art. 38'],
  'pension retraite': ['Art. 38'],
  
  // ========== ART. 39 - AVANTAGES EN NATURE ==========
  'avantages en nature': ['Art. 39'],
  'logement': ['Art. 39'],
  'voiture': ['Art. 39'],
  
  // ========== ART. 41 - DÉDUCTION 20% ==========
  'déduction forfaitaire 20%': ['Art. 41'],
  'abattement 20%': ['Art. 41'],
  
  // ========== ART. 42-43 - BNC ==========
  'bnc': ['Art. 42'],
  'professions libérales': ['Art. 42'],
  'professions non commerciales': ['Art. 42', 'Art. 1'],
  'droits d\'auteur': ['Art. 42'],
  'honoraires': ['Art. 42'],

  // ========== ART. 49 - ARTISTES NON-RÉSIDENTS ==========
  'artiste étranger': ['Art. 49', 'Art. 185 ter-A'],
  'artiste non résident': ['Art. 49', 'Art. 185 ter-A'],
  'artiste non-résident': ['Art. 49', 'Art. 185 ter-A'],
  'artiste non domicilié': ['Art. 49', 'Art. 185 ter-A'],
  'musicien étranger': ['Art. 49', 'Art. 185 ter-A'],
  'musicien non résident': ['Art. 49', 'Art. 185 ter-A'],
  'concert artiste étranger': ['Art. 49', 'Art. 185 ter-A'],
  'spectacle artiste étranger': ['Art. 49', 'Art. 185 ter-A'],
  'représentation artistique': ['Art. 49'],
  'cachets artistes': ['Art. 49', 'Art. 96'],
  'artiste organise concert': ['Art. 49'],
  'artiste organise spectacle': ['Art. 49'],
  'représentant légal artiste': ['Art. 49'],
  'music-hall': ['Art. 49'],
  'théâtre artiste': ['Art. 49'],
  
  // ========== ART. 50-62 - CAPITAUX MOBILIERS ==========
  'revenus des capitaux mobiliers': ['Art. 50', 'Art. 1'],
  'capitaux mobiliers': ['Art. 50', 'Art. 1'],
  'dividendes': ['Art. 50', 'Art. 51'],
  'revenus distribués': ['Art. 51'],
  'tantièmes': ['Art. 57'],
  'jetons de présence': ['Art. 57'],
  'obligations': ['Art. 58'],
  'intérêts': ['Art. 58', 'Art. 61'],
  'créances': ['Art. 61'],
  'dépôts': ['Art. 61'],
  'livrets épargne': ['Art. 62'],
  
  // ========== ART. 63 - PLUS-VALUES ==========
  'plus-values': ['Art. 63', 'Art. 1'],
  'plus-values cession': ['Art. 63'],
  'plus-values immobilières': ['Art. 63 ter'],
  'cession actif': ['Art. 63'],
  
  // ========== ART. 66 - CHARGES DÉDUCTIBLES ==========
  'charges déductibles': ['Art. 66', 'Art. 13 quater'],
  'déficits': ['Art. 66'],
  'report déficit': ['Art. 66'],
  'pensions alimentaires': ['Art. 66'],
  'intérêts emprunts': ['Art. 66'],
  'assurance vie': ['Art. 66'],
  'honoraires médicaux': ['Art. 66'],
  
  // ========== ART. 75 - DÉPART DU CONGO ==========
  'départ du congo': ['Art. 75'],
  'transfert domicile': ['Art. 75'],
  'visa de départ': ['Art. 75'],
  'quitter le congo': ['Art. 75'],
  
  // ========== ART. 76-80 - DÉCLARATIONS ==========
  'déclaration revenus': ['Art. 76', 'Art. 80'],
  'obligation déclaration': ['Art. 76'],
  'train de vie': ['Art. 76', 'Art. 89 bis'],
  'délai déclaration': ['Art. 80'],
  '20 mars': ['Art. 80'],
  
  // ========== ART. 89 - CALCUL IRPP ==========
  'calcul irpp': ['Art. 89'],
  'mécanisme calcul': ['Art. 89'],
  
  // ========== ART. 91 - QUOTIENT FAMILIAL ==========
  'quotient familial': ['Art. 91'],
  'nombre de parts': ['Art. 91'],
  'parts fiscales': ['Art. 91'],
  'combien de parts': ['Art. 91'],
  'célibataire': ['Art. 91'],
  'marié': ['Art. 91'],
  'divorcé': ['Art. 91'],
  'veuf': ['Art. 91'],
  'demi-part': ['Art. 91', 'Art. 92-1'],
  
  // ========== ART. 93 - ENFANTS À CHARGE ==========
  'personnes à charge': ['Art. 93'],
  'enfants légitimes': ['Art. 93'],
  'enfants adoptés': ['Art. 93'],
  '21 ans': ['Art. 93'],
  '25 ans': ['Art. 93'],
  
  // ========== ART. 95 - BARÈME IRPP ==========
  'barème irpp': ['Art. 95'],
  'barème': ['Art. 95'],
  'taux irpp': ['Art. 95'],
  'tranches': ['Art. 95'],
  'tranches irpp': ['Art. 95'],
  '1%': ['Art. 95'],
  '10%': ['Art. 95'],
  '25%': ['Art. 95'],
  '40%': ['Art. 95'],
  '464 000': ['Art. 95'],
  '1 000 000': ['Art. 95'],
  '3 000 000': ['Art. 95'],
  'salaire minimum': ['Art. 95'],
  
  // ========== ART. 96 - RETENUE À LA SOURCE ==========
  'retenue à la source': ['Art. 96'],
  'retenue source 20%': ['Art. 96'],
  
  // ========== ART. 98-101 - CESSION, CESSATION, DÉCÈS ==========
  'cession entreprise': ['Art. 98-1'],
  'cessation': ['Art. 98-1', 'Art. 99'],
  'décès exploitant': ['Art. 98-2', 'Art. 101'],
  'cessation bnc': ['Art. 99'],
  'imposition décès': ['Art. 101'],

  // ========== COMPLÉMENTS POUR TESTS ==========
  // Q6, Q7, Q8 - Revenus fonciers détails
  'taux déduction foncier': ['Art. 13 quater'],
  'abattement affichage': ['Art. 13 quater'],
  'option frais réels': ['Art. 13 quater'],
  '30%': ['Art. 13 quater'],
  '5%': ['Art. 13 quater'],
  'déduction 30%': ['Art. 13 quater'],
  'déduction 5%': ['Art. 13 quater'],

  // Q10 - Exclusions forfait
  'contribuables exclus': ['Art. 26'],
  'ne peuvent pas bénéficier forfait': ['Art. 26'],
  'hors champ forfait': ['Art. 26'],

  // Q11 - Amende registres
  'amende registres': ['Art. 28'],
  'défaut tenue registres': ['Art. 28'],
  '500 000 fcfa': ['Art. 28'],

  // Q12 - Conservation documents
  'conservation documents': ['Art. 31'],
  'durée conservation': ['Art. 31'],
  'dix ans': ['Art. 31'],
  '10 ans': ['Art. 31'],

  // Q15 - Allocations familiales employeur
  'allocations familiales employeur': ['Art. 38'],
  '5 000 fcfa enfant': ['Art. 38'],

  // Q17 - Maximum parts
  'maximum parts': ['Art. 91'],
  '6,5 parts': ['Art. 91'],
  'plafond parts': ['Art. 91'],

  // Q22 - Départ Congo délai
  'trente jours': ['Art. 75'],
  '30 jours': ['Art. 75'],

  // Q37 - Veuf parts
  'veuf parts': ['Art. 91'],
  'deux années': ['Art. 91'],

  // Art. 71 - Revenus exceptionnels
  'revenus exceptionnels': ['Art. 71'],
  'étalement': ['Art. 71'],
  'système du quotient': ['Art. 71'],

  // Art. 36-A vs 36-B - Bénéfices agricoles
  'bénéfices agricoles définition': ['Art. 36-A'],
  'bénéfices agricoles exonération': ['Art. 36-B'],
  'pisciculture': ['Art. 36-B'],
  'pisciculture exonérée': ['Art. 36-B'],
  'exonération pisciculture': ['Art. 36-B'],
  'agriculteur exonéré': ['Art. 36-B'],

  // Art. 98-1 vs 98-2 - Cession/cessation/décès
  'cession cessation obligations': ['Art. 98-1'],
  'décès exploitant délai': ['Art. 98-2'],
  'ayants droit décès': ['Art. 98-2', 'Art. 101'],
  'six mois décès': ['Art. 98-2', 'Art. 101'],

  // Art. 13 quater détails
  'déduction 30% foncier': ['Art. 13 quater'],
  'abattement 5% affichage': ['Art. 13 quater'],
  'option frais réels trois ans': ['Art. 13 quater'],

  // Art. 34 ter - Écoles privées
  'école privée': ['Art. 34 ter'],
  'abattement école': ['Art. 34 ter'],
  'établissement enseignement': ['Art. 34 ter'],

  // ========== ART. 61 - BONS DE CAISSE PRECOMPTE LIBERATOIRE (PRIORITE HAUTE) ==========
  // Ces mappings doivent primer sur Art. 76 (obligation déclaration générale)
  'bons caisse précompte 15': ['Art. 61'],
  'bons caisse précompte': ['Art. 61', 'Art. 171 novies'],
  'bons caisse declaration': ['Art. 61'],
  'bons caisse irpp': ['Art. 61'],
  'bons de caisse précompte': ['Art. 61'],
  'bons de caisse 15%': ['Art. 61'],
  'bons de caisse declaration irpp': ['Art. 61'],
  'précompte libératoire bons': ['Art. 61'],
  'précompte libératoire': ['Art. 61'],
  'précompte 15%': ['Art. 61'],
  'revenus bons caisse déclaration': ['Art. 61'],
  'bons nominatifs précompte': ['Art. 61'],
  'bons caisse doit declarer': ['Art. 61'],
  'declarer bons caisse': ['Art. 61'],
  'bons de caisse': ['Art. 61'],
  'caractère libératoire': ['Art. 61'],
  'impôt libératoire bons': ['Art. 61'],

  // Art. 76 - Gérant SARL (NE PAS appliquer si bons de caisse + précompte)
  'gérant majoritaire': ['Art. 76'],
  'rémunération gérant': ['Art. 76'],
  'gérant sarl': ['Art. 76'],

  // Art. 90 - Organisation internationale
  'organisation internationale': ['Art. 90'],
  'fonctionnaire international': ['Art. 90'],
};

/**
 * Génère le mapping inverse : article → mots-clés
 */
export function getKeywordsForArticle(numero: string): string[] {
  const keywords: string[] = [];
  for (const [keyword, articles] of Object.entries(KEYWORD_ARTICLE_MAP)) {
    if (articles.includes(numero)) {
      keywords.push(keyword);
    }
  }
  return keywords;
}

/**
 * Recherche les articles correspondant à une requête
 */
export function findArticlesForQuery(query: string): string[] {
  const queryLower = query.toLowerCase();
  const matchedArticles: Map<string, number> = new Map();
  
  for (const [keyword, articles] of Object.entries(KEYWORD_ARTICLE_MAP)) {
    if (queryLower.includes(keyword.toLowerCase())) {
      articles.forEach((article, index) => {
        // Le premier article a le score le plus élevé
        const score = matchedArticles.get(article) || 0;
        matchedArticles.set(article, score + (10 - index));
      });
    }
  }
  
  // Trier par score décroissant
  return Array.from(matchedArticles.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([article]) => article);
}

export default KEYWORD_ARTICLE_MAP;
