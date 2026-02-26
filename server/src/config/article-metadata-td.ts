/**
 * Metadata des articles du CGI 2025 - Chapitre 5
 * Taxes Diverses (Art. 157 a 171 L)
 *
 * @author NORMX AI - CGI 242
 * @version 2025
 */

export interface ArticleMetadataTD {
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

export const ARTICLE_METADATA_TD: Record<string, ArticleMetadataTD> = {
  // ========== SECTION 2 - TAXES SUR LES TERRAINS ==========
  'Art. 157': {
    numero: 'Art. 157',
    titre: 'Principe des taxes sur les terrains',
    section: 'Taxes terrains',
    themes: ['taxes terrains', 'agrement', 'non mis en valeur', 'a batir', 'inexploites'],
    priority: 1,
    defines: ['taxes sur les terrains'],
    statut: 'en_vigueur',
  },

  'Art. 158': {
    numero: 'Art. 158',
    titre: 'Champ territorial',
    section: 'Taxes terrains',
    themes: ['communes', 'Brazzaville', 'Pointe-Noire', 'Loudima', 'Loubomo'],
    priority: 1,
    defines: ['communes concernees'],
    statut: 'en_vigueur',
  },

  'Art. 159': {
    numero: 'Art. 159',
    titre: 'Definitions des terrains',
    section: 'Taxes terrains',
    themes: ['definitions', 'terrain agrement', 'insuffisamment mis en valeur', 'a batir'],
    priority: 1,
    defines: ['terrain agrement', 'terrain insuffisamment mis en valeur', 'terrain a batir'],
    valeurs: ['5 fois superficie'],
    statut: 'en_vigueur',
  },

  'Art. 160': {
    numero: 'Art. 160',
    titre: 'Exploitation des terrains',
    section: 'Taxes terrains',
    themes: ['exploitation', 'jachere', 'plantation', 'concession'],
    priority: 1,
    defines: ['terrain exploite', 'terrain inexploite'],
    valeurs: ['3 ans', '51%'],
    statut: 'en_vigueur',
  },

  'Art. 161': {
    numero: 'Art. 161',
    titre: 'Exemptions permanentes',
    section: 'Taxes terrains',
    themes: ['exemptions permanentes', 'lotissement', 'voie carrossable'],
    priority: 1,
    defines: ['exemptions terrains'],
    valeurs: ['100 metres'],
    statut: 'en_vigueur',
  },

  'Art. 162': {
    numero: 'Art. 162',
    titre: 'Exemptions temporaires',
    section: 'Taxes terrains',
    themes: ['exemptions temporaires', 'programme investissement', 'majoration'],
    priority: 1,
    defines: ['exemption temporaire terrain'],
    valeurs: ['3 ans', '25%'],
    statut: 'en_vigueur',
  },

  'Art. 163': {
    numero: 'Art. 163',
    titre: 'Redevable',
    section: 'Taxes terrains',
    themes: ['redevable', 'proprietaire', 'usufruitier', 'emphyteote'],
    priority: 2,
    defines: ['redevable taxe terrain'],
    statut: 'en_vigueur',
  },

  'Art. 164': {
    numero: 'Art. 164',
    titre: 'Fait generateur',
    section: 'Taxes terrains',
    themes: ['fait generateur', '1er janvier'],
    priority: 2,
    defines: ['fait generateur taxe terrain'],
    statut: 'en_vigueur',
  },

  'Art. 165': {
    numero: 'Art. 165',
    titre: 'Tarifs des taxes sur les terrains',
    section: 'Taxes terrains',
    themes: ['tarifs', 'taux', 'categories', 'classes'],
    priority: 1,
    defines: ['tarifs taxes terrains'],
    valeurs: ['15 F/m2', '5 F/m2', '40 F/m2', '30 F/m2', '20 F/m2', '10 F/m2', '250 F/ha', '500 FCFA'],
    statut: 'en_vigueur',
  },

  'Art. 166': {
    numero: 'Art. 166',
    titre: 'Declarations',
    section: 'Taxes terrains',
    themes: ['declarations', 'obligations'],
    priority: 2,
    defines: ['declaration taxe terrain'],
    valeurs: ['1er avril'],
    statut: 'en_vigueur',
  },

  'Art. 167': {
    numero: 'Art. 167',
    titre: 'Titre provisoire',
    section: 'Taxes terrains',
    themes: ['titre provisoire', 'titre definitif'],
    priority: 2,
    statut: 'en_vigueur',
  },

  'Art. 167 bis': {
    numero: 'Art. 167 bis',
    titre: 'Exoneration titre',
    section: 'Taxes terrains',
    themes: ['exoneration', 'titre'],
    priority: 2,
    statut: 'en_vigueur',
  },

  // ========== SECTION 3 - TAXE SPECIALE SUR LES SOCIETES ==========
  'Art. 168': {
    numero: 'Art. 168',
    titre: 'Champ de la TSS',
    section: 'TSS',
    themes: ['TSS', 'champ application', 'societes'],
    priority: 1,
    defines: ['taxe speciale societes', 'TSS'],
    keywords: ['SA', 'SARL', 'SCA', 'SNC'],
    statut: 'en_vigueur',
  },

  'Art. 169': {
    numero: 'Art. 169',
    titre: 'Exonerations TSS',
    section: 'TSS',
    themes: ['exonerations', 'agriculture', 'peche', 'elevage'],
    priority: 1,
    defines: ['exonerations TSS'],
    valeurs: ['1er janvier 2010'],
    statut: 'en_vigueur',
  },

  'Art. 170': {
    numero: 'Art. 170',
    titre: 'Taux et minimum TSS',
    section: 'TSS',
    themes: ['taux', 'minimum', 'deficitaire'],
    priority: 1,
    defines: ['taux TSS', 'minimum TSS'],
    valeurs: ['1%', '2%', '1 000 000 FCFA', '500 000 FCFA', '10 000 000 FCFA', '2 exercices'],
    statut: 'en_vigueur',
  },

  'Art. 171': {
    numero: 'Art. 171',
    titre: 'Paiement et imputation TSS',
    section: 'TSS',
    themes: ['paiement', 'imputation', 'sanctions'],
    priority: 1,
    defines: ['paiement TSS', 'imputation IS'],
    valeurs: ['10-20 mars', 'doublement'],
    statut: 'en_vigueur',
  },

  // ========== SECTION 5 - IMPOT SUR LES BONS DE CAISSE ==========
  'Art. 171 sexies': {
    numero: 'Art. 171 sexies',
    titre: 'Champ bons de caisse',
    section: 'Bons de caisse',
    themes: ['bons de caisse', 'bons nominatifs', 'bons au porteur'],
    priority: 1,
    defines: ['impot bons de caisse'],
    statut: 'en_vigueur',
  },

  'Art. 171 septies': {
    numero: 'Art. 171 septies',
    titre: 'Territorialite bons',
    section: 'Bons de caisse',
    themes: ['territorialite', 'emission'],
    priority: 2,
    statut: 'en_vigueur',
  },

  'Art. 171 octies': {
    numero: 'Art. 171 octies',
    titre: 'Versement impot bons',
    section: 'Bons de caisse',
    themes: ['versement', 'paiement'],
    priority: 1,
    defines: ['versement impot bons'],
    valeurs: ['15 premiers jours'],
    statut: 'en_vigueur',
  },

  'Art. 171 novies': {
    numero: 'Art. 171 novies',
    titre: 'Taux bons de caisse',
    section: 'Bons de caisse',
    themes: ['taux', 'nominatifs', 'porteur'],
    priority: 1,
    defines: ['taux bons de caisse'],
    valeurs: ['15%', '30%'],
    statut: 'en_vigueur',
  },

  'Art. 171 decies': {
    numero: 'Art. 171 decies',
    titre: 'Non-deductibilite bons',
    section: 'Bons de caisse',
    themes: ['non-deductibilite', 'IRPP', 'IS'],
    priority: 2,
    statut: 'en_vigueur',
  },

  'Art. 171 undecies': {
    numero: 'Art. 171 undecies',
    titre: 'Sanctions bons de caisse',
    section: 'Bons de caisse',
    themes: ['sanctions', 'penalites'],
    priority: 2,
    statut: 'en_vigueur',
  },

  // ========== SECTION 6 - TAXE VEHICULES TOURISME ==========
  'Art. 171 A': {
    numero: 'Art. 171 A',
    titre: 'Principe TVS',
    section: 'TVS',
    themes: ['TVS', 'principe', 'vehicules tourisme'],
    priority: 1,
    defines: ['taxe vehicules tourisme', 'TVS'],
    statut: 'en_vigueur',
  },

  'Art. 171 B': {
    numero: 'Art. 171 B',
    titre: 'Redevable TVS',
    section: 'TVS',
    themes: ['redevable', 'societes', 'credit-bail'],
    priority: 1,
    defines: ['redevable TVS'],
    statut: 'en_vigueur',
  },

  'Art. 171 C': {
    numero: 'Art. 171 C',
    titre: 'Vehicules concernes',
    section: 'TVS',
    themes: ['vehicules concernes', 'voitures particulieres'],
    priority: 1,
    defines: ['vehicules soumis TVS'],
    statut: 'en_vigueur',
  },

  'Art. 171 D': {
    numero: 'Art. 171 D',
    titre: 'Exoneration TVS',
    section: 'TVS',
    themes: ['exoneration', 'anciennete'],
    priority: 1,
    defines: ['exoneration TVS'],
    valeurs: ['10 ans'],
    statut: 'en_vigueur',
  },

  'Art. 171 E': {
    numero: 'Art. 171 E',
    titre: 'Periode imposition TVS',
    section: 'TVS',
    themes: ['periode imposition', 'annee civile'],
    priority: 2,
    statut: 'en_vigueur',
  },

  'Art. 171 F': {
    numero: 'Art. 171 F',
    titre: 'Montant TVS',
    section: 'TVS',
    themes: ['montant', 'tarif'],
    priority: 1,
    defines: ['montant TVS'],
    valeurs: ['200 000 FCFA'],
    statut: 'en_vigueur',
  },

  'Art. 171 G': {
    numero: 'Art. 171 G',
    titre: 'Liquidation TVS',
    section: 'TVS',
    themes: ['liquidation', 'calcul'],
    priority: 2,
    statut: 'en_vigueur',
  },

  'Art. 171 I': {
    numero: 'Art. 171 I',
    titre: 'Declaration TVS',
    section: 'TVS',
    themes: ['declaration', 'paiement'],
    priority: 1,
    defines: ['declaration TVS'],
    valeurs: ['1er mars'],
    statut: 'en_vigueur',
  },

  'Art. 171 J': {
    numero: 'Art. 171 J',
    titre: 'Sanctions TVS',
    section: 'TVS',
    themes: ['sanctions', 'penalites'],
    priority: 2,
    statut: 'en_vigueur',
  },

  'Art. 171 K': {
    numero: 'Art. 171 K',
    titre: 'Non-deductibilite TVS',
    section: 'TVS',
    themes: ['non-deductibilite', 'IS'],
    priority: 2,
    defines: ['non-deductibilite TVS'],
    statut: 'en_vigueur',
  },

  'Art. 171 L': {
    numero: 'Art. 171 L',
    titre: 'Obligations TVS',
    section: 'TVS',
    themes: ['obligations', 'registre'],
    priority: 2,
    statut: 'en_vigueur',
  },
};

/**
 * Articles prioritaires par theme
 */
export const PRIORITY_ARTICLES_TD: Record<string, string[]> = {
  'terrains': ['Art. 157', 'Art. 159', 'Art. 165', 'Art. 161'],
  'tss': ['Art. 168', 'Art. 170', 'Art. 171'],
  'bons_caisse': ['Art. 171 sexies', 'Art. 171 novies', 'Art. 171 octies'],
  'tvs': ['Art. 171 A', 'Art. 171 F', 'Art. 171 D', 'Art. 171 I'],
  'taux': ['Art. 165', 'Art. 170', 'Art. 171 novies', 'Art. 171 F'],
  'exonerations': ['Art. 161', 'Art. 162', 'Art. 169', 'Art. 171 D'],
  'declarations': ['Art. 166', 'Art. 171', 'Art. 171 octies', 'Art. 171 I'],
};
