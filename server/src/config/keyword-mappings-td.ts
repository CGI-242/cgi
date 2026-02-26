/**
 * Mapping des mots-cles vers les articles du CGI 2025
 * Chapitre 5 - Taxes Diverses (Art. 157 a 171 L)
 *
 * REGLE : Le premier article de chaque liste est la SOURCE PRIMAIRE
 *
 * @author NORMX AI - CGI 242
 * @version 2025
 */

export const KEYWORD_ARTICLE_MAP_TD: Record<string, string[]> = {

  // ========== TAXES SUR LES TERRAINS - DEFINITIONS ==========
  'taxes terrains': ['Art. 157'],
  'taxe terrain': ['Art. 157'],
  'terrain agrement': ['Art. 157', 'Art. 159'],
  'terrain non mis en valeur': ['Art. 157', 'Art. 159'],
  'terrain insuffisamment mis en valeur': ['Art. 159'],
  'terrain a batir': ['Art. 157', 'Art. 159'],
  'terrain inexploite': ['Art. 157', 'Art. 160'],
  'terrain insuffisamment exploite': ['Art. 160'],
  '5 fois superficie': ['Art. 159'],
  'jachere': ['Art. 160'],
  '3 ans plantation': ['Art. 160'],
  '51% superficie': ['Art. 160'],

  // ========== TAXES TERRAINS - COMMUNES ==========
  'brazzaville terrain': ['Art. 158'],
  'pointe-noire terrain': ['Art. 158'],
  'loudima': ['Art. 158'],
  'loubomo terrain': ['Art. 158', 'Art. 165'],
  'terrains urbains': ['Art. 158'],

  // ========== TAXES TERRAINS - EXEMPTIONS ==========
  'exemption terrain': ['Art. 161'],
  'exemption temporaire terrain': ['Art. 162'],
  'lotissement': ['Art. 161'],
  'voie carrossable': ['Art. 161'],
  '100 metres': ['Art. 161'],
  'programme investissement terrain': ['Art. 162'],
  '25% majoration terrain': ['Art. 162'],

  // ========== TAXES TERRAINS - REDEVABLE ==========
  'redevable terrain': ['Art. 163'],
  'proprietaire terrain': ['Art. 163'],
  'usufruitier': ['Art. 163'],
  'emphyteote': ['Art. 163'],
  '1er janvier terrain': ['Art. 164'],
  'fait generateur terrain': ['Art. 164'],

  // ========== TAXES TERRAINS - TARIFS ==========
  'tarif terrain': ['Art. 165'],
  '15 f/m2': ['Art. 165'],
  '5 f/m2': ['Art. 165'],
  '40 f/m2': ['Art. 165'],
  '30 f/m2': ['Art. 165'],
  '20 f/m2': ['Art. 165'],
  '10 f/m2': ['Art. 165'],
  '250 f/ha': ['Art. 165'],
  'terrain marecageux': ['Art. 165'],
  'classes terrain': ['Art. 165'],
  '500 fcfa minimum terrain': ['Art. 165'],

  // ========== TAXES TERRAINS - DECLARATIONS ==========
  'declaration terrain': ['Art. 166'],
  '1er avril terrain': ['Art. 166'],
  'titre provisoire': ['Art. 167'],
  'titre definitif': ['Art. 167'],
  'exoneration titre': ['Art. 167 bis'],

  // ========== TSS - TAXE SPECIALE SUR LES SOCIETES ==========
  'tss': ['Art. 168'],
  'taxe speciale societes': ['Art. 168'],
  'minimum fiscal societes': ['Art. 168'],
  'minimum imposition societes': ['Art. 168'],
  'sa tss': ['Art. 168'],
  'sarl tss': ['Art. 168'],
  'sca': ['Art. 168'],

  // ========== TSS - EXONERATIONS ==========
  'exoneration tss': ['Art. 169'],
  'agriculture tss': ['Art. 169'],
  'peche tss': ['Art. 169'],
  'elevage tss': ['Art. 169'],
  'premier exercice tss': ['Art. 169'],

  // ========== TSS - TAUX ET MINIMUM ==========
  'taux tss': ['Art. 170'],
  '1% tss': ['Art. 170'],
  '2% tss': ['Art. 170'],
  'deficitaire tss': ['Art. 170'],
  '2 exercices consecutifs': ['Art. 170'],
  'minimum tss': ['Art. 170'],
  '1 000 000 fcfa tss': ['Art. 170'],
  '500 000 fcfa tss': ['Art. 170'],
  '10 000 000 fcfa ca': ['Art. 170'],
  'societes forestieres': ['Art. 170'],
  'marketeurs petroliers': ['Art. 170'],
  'marge distribution': ['Art. 170'],

  // ========== TSS - PAIEMENT ==========
  'paiement tss': ['Art. 171'],
  '10-20 mars': ['Art. 171'],
  'imputation tss': ['Art. 171'],
  'deduction is tss': ['Art. 171'],
  'doublement tss': ['Art. 171'],
  'sanction tss': ['Art. 171'],

  // ========== BONS DE CAISSE ==========
  'bons de caisse': ['Art. 171 sexies'],
  'bons nominatifs': ['Art. 171 sexies'],
  'bons au porteur': ['Art. 171 sexies', 'Art. 171 novies'],
  'impot bons caisse': ['Art. 171 sexies'],
  'territorialite bons': ['Art. 171 septies'],
  'versement bons': ['Art. 171 octies'],
  '15 premiers jours': ['Art. 171 octies'],
  'taux bons nominatifs': ['Art. 171 novies'],
  '15% bons': ['Art. 171 novies'],
  '30% bons porteur': ['Art. 171 novies'],
  'non deductibilite bons': ['Art. 171 decies'],
  'sanctions bons': ['Art. 171 undecies'],

  // ========== BONS DE CAISSE - REFERENCE CROISEE IRPP ==========
  'bons caisse declaration irpp': ['Art. 61', 'Art. 171 novies'],
  'bons caisse irpp': ['Art. 61', 'Art. 171 novies'],
  'precompte 15% bons': ['Art. 61', 'Art. 171 novies'],
  'precompte liberatoire bons': ['Art. 61', 'Art. 171 novies'],
  'declarer bons caisse': ['Art. 61', 'Art. 171 novies'],
  'declaration irpp bons': ['Art. 61', 'Art. 50', 'Art. 58'],
  'bons caisse liberatoire': ['Art. 61', 'Art. 97'],

  // ========== TVS - TAXE VEHICULES TOURISME ==========
  'tvs': ['Art. 171 A'],
  'taxe vehicules tourisme': ['Art. 171 A'],
  'vehicules tourisme societes': ['Art. 171 A'],
  'voiture societe': ['Art. 171 A'],
  'redevable tvs': ['Art. 171 B'],
  'credit-bail tvs': ['Art. 171 B'],
  'vehicules concernes tvs': ['Art. 171 C'],
  'voitures particulieres': ['Art. 171 C'],
  'exoneration tvs': ['Art. 171 D'],
  '10 ans tvs': ['Art. 171 D'],
  'periode imposition tvs': ['Art. 171 E'],
  'montant tvs': ['Art. 171 F'],
  '200 000 fcfa tvs': ['Art. 171 F'],
  'liquidation tvs': ['Art. 171 G'],
  'declaration tvs': ['Art. 171 I'],
  '1er mars tvs': ['Art. 171 I'],
  'sanctions tvs': ['Art. 171 J'],
  'non deductibilite tvs': ['Art. 171 K'],
  'obligations tvs': ['Art. 171 L'],

  // ========== ABROGATIONS ==========
  'taxe apprentissage': ['Art. 141'],
  'tus': ['Art. 141'],
  'taxe unique salaires': ['Art. 141'],
};

/**
 * Synonymes pour expansion de requetes CGI 2025 Chapitre 5
 */
export const SYNONYMS_TD: Record<string, string[]> = {
  'tss': ['taxe speciale societes', 'minimum fiscal', 'minimum imposition'],
  'tvs': ['taxe vehicules tourisme', 'taxe voitures societes', 'vehicule entreprise'],
  'terrain agrement': ['jardin', 'terrain autour construction'],
  'terrain a batir': ['terrain nu', 'terrain vide', 'terrain non construit'],
  'terrain inexploite': ['terrain en friche', 'terrain non cultive'],
  'bons de caisse': ['bons nominatifs', 'bons au porteur', 'emprunts'],
  'exemption': ['exoneration', 'dispense', 'franchise'],
  // Expansion pour référence croisée IRPP
  'bons caisse declaration irpp': ['precompte liberatoire', 'irpp bons', 'declarer revenus bons'],
  'precompte 15%': ['retenue liberatoire', 'impot liberatoire bons'],
};

/**
 * Query expansion pour les bons de caisse vers IRPP
 */
export const QUERY_EXPANSION_TD: Record<string, string[]> = {
  'bons_caisse_declaration': ['precompte liberatoire', 'irpp bons', 'declarer revenus bons', 'declaration irpp'],
};
