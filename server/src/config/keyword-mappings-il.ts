// server/src/config/keyword-mappings-il.ts
// Mappings mots-clés → articles pour Partie 2 Titre 1 Chapitre 1 - Impôts Locaux (CGI 2025)

/**
 * Map de mots-clés vers les articles pertinents des impôts locaux
 * Structure: mot-clé/expression → liste d'articles avec poids
 */
export const KEYWORD_ARTICLE_MAP_IL: Record<string, Array<{ article: string; weight: number }>> = {
  // ==================== GÉNÉRALITÉS (Art. 250) ====================

  'impôts locaux': [
    { article: 'Art. 250', weight: 1.0 },
  ],
  'impots locaux': [
    { article: 'Art. 250', weight: 1.0 },
  ],
  'répartition impôts': [
    { article: 'Art. 250', weight: 1.0 },
  ],
  '85%': [
    { article: 'Art. 250', weight: 0.9 },
  ],
  '85% collectivités': [
    { article: 'Art. 250', weight: 1.0 },
  ],
  '10% administration': [
    { article: 'Art. 250', weight: 1.0 },
  ],
  '5% chambres commerce': [
    { article: 'Art. 250', weight: 1.0 },
  ],
  'collectivités locales': [
    { article: 'Art. 250', weight: 0.9 },
  ],
  'chambres de commerce': [
    { article: 'Art. 250', weight: 0.9 },
  ],

  // ==================== CFPB - CONTRIBUTION FONCIÈRE PROPRIÉTÉS BÂTIES (Art. 251-262) ====================

  // Champ d'application et redevables
  'cfpb': [
    { article: 'Art. 251', weight: 1.0 },
    { article: 'Art. 252', weight: 0.9 },
    { article: 'Art. 257', weight: 0.8 },
    { article: 'Art. 258 ter', weight: 0.8 },
  ],
  'contribution foncière propriétés bâties': [
    { article: 'Art. 251', weight: 1.0 },
    { article: 'Art. 252', weight: 0.9 },
  ],
  'propriétés bâties': [
    { article: 'Art. 251', weight: 1.0 },
    { article: 'Art. 252', weight: 0.9 },
    { article: 'Art. 253', weight: 0.8 },
  ],
  'proprietes baties': [
    { article: 'Art. 251', weight: 1.0 },
    { article: 'Art. 252', weight: 0.9 },
  ],
  'foncier bâti': [
    { article: 'Art. 251', weight: 1.0 },
    { article: 'Art. 257', weight: 0.9 },
  ],
  'impôt foncier bâti': [
    { article: 'Art. 251', weight: 1.0 },
    { article: 'Art. 258 ter', weight: 0.9 },
  ],
  'constructions': [
    { article: 'Art. 251', weight: 0.9 },
    { article: 'Art. 253', weight: 0.8 },
  ],
  'bâtiments': [
    { article: 'Art. 251', weight: 0.9 },
    { article: 'Art. 253', weight: 0.8 },
  ],
  'immeubles': [
    { article: 'Art. 251', weight: 0.9 },
    { article: 'Art. 252', weight: 0.8 },
  ],
  'propriétaire': [
    { article: 'Art. 252', weight: 1.0 },
  ],
  'usufruitier': [
    { article: 'Art. 252', weight: 1.0 },
  ],
  'usufruit': [
    { article: 'Art. 252', weight: 1.0 },
  ],
  'redevable cfpb': [
    { article: 'Art. 252', weight: 1.0 },
  ],

  // Exemptions CFPB
  'exemption cfpb': [
    { article: 'Art. 253', weight: 1.0 },
    { article: 'Art. 254', weight: 1.0 },
  ],
  'exonération cfpb': [
    { article: 'Art. 253', weight: 1.0 },
    { article: 'Art. 254', weight: 1.0 },
  ],
  'exemptions permanentes': [
    { article: 'Art. 253', weight: 1.0 },
  ],
  'exemptions temporaires': [
    { article: 'Art. 254', weight: 1.0 },
  ],
  'édifices culte': [
    { article: 'Art. 253', weight: 0.9 },
  ],
  'bâtiments agricoles': [
    { article: 'Art. 253', weight: 0.9 },
  ],
  'granges': [
    { article: 'Art. 253', weight: 0.9 },
  ],
  'hangars': [
    { article: 'Art. 253', weight: 0.9 },
  ],
  'écuries': [
    { article: 'Art. 253', weight: 0.9 },
  ],
  'ambassades': [
    { article: 'Art. 253', weight: 0.9 },
  ],
  'défense passive': [
    { article: 'Art. 253', weight: 0.9 },
  ],
  'constructions nouvelles': [
    { article: 'Art. 254', weight: 1.0 },
  ],
  '5 ans exemption': [
    { article: 'Art. 254', weight: 1.0 },
  ],
  '10 ans exemption': [
    { article: 'Art. 254', weight: 1.0 },
  ],
  '25 ans exemption': [
    { article: 'Art. 254', weight: 1.0 },
  ],
  'habitation principale': [
    { article: 'Art. 254', weight: 0.9 },
  ],
  'logement personnel': [
    { article: 'Art. 254', weight: 1.0 },
  ],

  // Base et valeur locative CFPB
  'valeur locative': [
    { article: 'Art. 257', weight: 1.0 },
    { article: 'Art. 257 bis', weight: 0.9 },
    { article: 'Art. 276', weight: 0.8 },
  ],
  'valeur locative cadastrale': [
    { article: 'Art. 257', weight: 1.0 },
  ],
  'revenu cadastral': [
    { article: 'Art. 257', weight: 0.9 },
  ],
  '75% déduction': [
    { article: 'Art. 257', weight: 1.0 },
  ],
  'déduction 75%': [
    { article: 'Art. 257', weight: 1.0 },
  ],
  'frais gestion': [
    { article: 'Art. 257', weight: 0.9 },
  ],
  'frais entretien': [
    { article: 'Art. 257', weight: 0.9 },
  ],
  'zones tarifaires': [
    { article: 'Art. 258', weight: 1.0 },
    { article: 'Art. 258 bis', weight: 0.9 },
    { article: 'Art. 270', weight: 0.8 },
  ],
  'zone 1': [
    { article: 'Art. 258', weight: 0.9 },
    { article: 'Art. 270', weight: 0.8 },
  ],
  'zone 2': [
    { article: 'Art. 258', weight: 0.9 },
    { article: 'Art. 270', weight: 0.8 },
  ],
  'zone 3': [
    { article: 'Art. 258', weight: 0.9 },
    { article: 'Art. 270', weight: 0.8 },
  ],
  'zone 4': [
    { article: 'Art. 258', weight: 0.9 },
    { article: 'Art. 270', weight: 0.8 },
  ],
  '250 fcfa': [
    { article: 'Art. 258', weight: 1.0 },
  ],
  '150 fcfa': [
    { article: 'Art. 258', weight: 1.0 },
  ],
  '25 fcfa': [
    { article: 'Art. 258', weight: 0.9 },
  ],
  '12,5 fcfa': [
    { article: 'Art. 258', weight: 0.9 },
  ],
  'prix m2': [
    { article: 'Art. 258', weight: 0.9 },
    { article: 'Art. 270', weight: 0.8 },
  ],
  'prix mètre carré': [
    { article: 'Art. 258', weight: 0.9 },
  ],
  'centre-ville': [
    { article: 'Art. 258', weight: 0.9 },
    { article: 'Art. 270', weight: 0.8 },
  ],
  'communes plein exercice': [
    { article: 'Art. 258', weight: 0.9 },
  ],
  'chefs-lieux départements': [
    { article: 'Art. 258', weight: 0.9 },
  ],
  'chefs-lieux districts': [
    { article: 'Art. 258', weight: 0.9 },
  ],
  'réduction étage': [
    { article: 'Art. 258 bis', weight: 1.0 },
  ],
  '50% par étage': [
    { article: 'Art. 258 bis', weight: 1.0 },
  ],

  // Taux CFPB
  'taux cfpb': [
    { article: 'Art. 258 ter', weight: 1.0 },
  ],
  '20% cfpb': [
    { article: 'Art. 258 ter', weight: 1.0 },
  ],
  'taux maximum cfpb': [
    { article: 'Art. 258 ter', weight: 1.0 },
  ],
  '1000 fcfa minimum': [
    { article: 'Art. 258 ter', weight: 0.9 },
    { article: 'Art. 272', weight: 0.8 },
  ],
  'minimum perception': [
    { article: 'Art. 258 ter', weight: 0.9 },
    { article: 'Art. 272', weight: 0.8 },
  ],

  // Déclarations et paiement CFPB
  'déclaration cfpb': [
    { article: 'Art. 260', weight: 1.0 },
    { article: 'Art. 261', weight: 0.9 },
  ],
  'fait générateur': [
    { article: 'Art. 260', weight: 1.0 },
  ],
  '1er janvier': [
    { article: 'Art. 260', weight: 0.9 },
  ],
  'avis imposition': [
    { article: 'Art. 261', weight: 0.9 },
    { article: 'Art. 274', weight: 0.8 },
  ],
  'paiement cfpb': [
    { article: 'Art. 262', weight: 1.0 },
  ],
  'réclamation': [
    { article: 'Art. 262', weight: 0.9 },
    { article: 'Art. 275', weight: 0.8 },
  ],

  // ==================== CFPNB - CONTRIBUTION FONCIÈRE PROPRIÉTÉS NON BÂTIES (Art. 263-275) ====================

  'cfpnb': [
    { article: 'Art. 263', weight: 1.0 },
    { article: 'Art. 264', weight: 0.9 },
    { article: 'Art. 270', weight: 0.8 },
    { article: 'Art. 272', weight: 0.8 },
  ],
  'contribution foncière propriétés non bâties': [
    { article: 'Art. 263', weight: 1.0 },
    { article: 'Art. 264', weight: 0.9 },
  ],
  'propriétés non bâties': [
    { article: 'Art. 263', weight: 1.0 },
    { article: 'Art. 264', weight: 0.9 },
    { article: 'Art. 265', weight: 0.8 },
  ],
  'proprietes non baties': [
    { article: 'Art. 263', weight: 1.0 },
    { article: 'Art. 264', weight: 0.9 },
  ],
  'foncier non bâti': [
    { article: 'Art. 263', weight: 1.0 },
    { article: 'Art. 270', weight: 0.9 },
  ],
  'impôt foncier non bâti': [
    { article: 'Art. 263', weight: 1.0 },
    { article: 'Art. 272', weight: 0.9 },
  ],
  'terrains': [
    { article: 'Art. 263', weight: 0.9 },
    { article: 'Art. 264', weight: 0.8 },
  ],
  'terrains urbains': [
    { article: 'Art. 264', weight: 1.0 },
  ],
  'terrains ruraux': [
    { article: 'Art. 264', weight: 1.0 },
    { article: 'Art. 270 bis', weight: 0.9 },
  ],
  'sols': [
    { article: 'Art. 263', weight: 0.8 },
  ],
  'périmètre urbain': [
    { article: 'Art. 264', weight: 0.9 },
  ],

  // Exemptions CFPNB
  'exemption cfpnb': [
    { article: 'Art. 265', weight: 1.0 },
    { article: 'Art. 266', weight: 1.0 },
  ],
  'exonération cfpnb': [
    { article: 'Art. 265', weight: 1.0 },
    { article: 'Art. 266', weight: 1.0 },
  ],
  'propriétés état': [
    { article: 'Art. 265', weight: 0.9 },
  ],
  'voies ferrées': [
    { article: 'Art. 265', weight: 0.9 },
  ],
  'canaux navigation': [
    { article: 'Art. 265', weight: 0.9 },
  ],
  'cimetières': [
    { article: 'Art. 265', weight: 0.9 },
  ],
  'cultures maraîchères': [
    { article: 'Art. 266', weight: 1.0 },
  ],
  '5 hectares': [
    { article: 'Art. 266', weight: 0.9 },
  ],
  '25 km agglomération': [
    { article: 'Art. 266', weight: 0.9 },
  ],
  'plantations nouvelles': [
    { article: 'Art. 266', weight: 0.9 },
  ],
  'élevage': [
    { article: 'Art. 266', weight: 0.9 },
    { article: 'Art. 270 bis', weight: 0.8 },
  ],
  '6 ans élevage': [
    { article: 'Art. 266', weight: 1.0 },
  ],
  'hévéas': [
    { article: 'Art. 266', weight: 0.9 },
  ],
  'palmiers': [
    { article: 'Art. 266', weight: 0.9 },
    { article: 'Art. 270 bis', weight: 0.8 },
  ],
  '10 ans palmiers': [
    { article: 'Art. 266', weight: 1.0 },
  ],
  'arbres fruitiers': [
    { article: 'Art. 266', weight: 0.9 },
  ],
  '8 ans fruitiers': [
    { article: 'Art. 266', weight: 1.0 },
  ],
  'café cacao': [
    { article: 'Art. 266', weight: 0.9 },
  ],
  '7 ans café': [
    { article: 'Art. 266', weight: 1.0 },
  ],
  '3 ans cultures': [
    { article: 'Art. 266', weight: 1.0 },
  ],

  // Déclarations CFPNB
  'déclaration cfpnb': [
    { article: 'Art. 267', weight: 1.0 },
    { article: 'Art. 268', weight: 0.9 },
  ],
  'avant 1er octobre': [
    { article: 'Art. 267', weight: 1.0 },
    { article: 'Art. 276', weight: 0.9 },
  ],

  // Base et tarifs CFPNB
  'valeur cadastrale': [
    { article: 'Art. 270', weight: 1.0 },
  ],
  '50% base': [
    { article: 'Art. 270', weight: 1.0 },
  ],
  'base 50%': [
    { article: 'Art. 270', weight: 1.0 },
  ],
  '125 fcfa': [
    { article: 'Art. 270', weight: 1.0 },
  ],
  '75 fcfa': [
    { article: 'Art. 270', weight: 1.0 },
  ],
  '6,25 fcfa': [
    { article: 'Art. 270', weight: 0.9 },
  ],
  'tarifs ruraux': [
    { article: 'Art. 270 bis', weight: 1.0 },
  ],
  'tarif hectare': [
    { article: 'Art. 270 bis', weight: 1.0 },
  ],
  '2000 fcfa/ha': [
    { article: 'Art. 270 bis', weight: 1.0 },
  ],
  '1000 fcfa/ha': [
    { article: 'Art. 270 bis', weight: 1.0 },
  ],
  '600 fcfa/ha': [
    { article: 'Art. 270 bis', weight: 1.0 },
  ],
  'caféiers': [
    { article: 'Art. 270 bis', weight: 0.9 },
  ],
  'caoutchouc': [
    { article: 'Art. 270 bis', weight: 0.9 },
  ],
  'forêts': [
    { article: 'Art. 270 bis', weight: 0.9 },
  ],
  'non mis en valeur': [
    { article: 'Art. 270 bis', weight: 0.9 },
  ],

  // Taux CFPNB
  'taux cfpnb': [
    { article: 'Art. 272', weight: 1.0 },
  ],
  '40% cfpnb': [
    { article: 'Art. 272', weight: 1.0 },
  ],
  'taux maximum cfpnb': [
    { article: 'Art. 272', weight: 1.0 },
  ],

  // Paiement CFPNB
  'paiement cfpnb': [
    { article: 'Art. 275', weight: 1.0 },
  ],

  // Dispositions communes
  'déclaration locataires': [
    { article: 'Art. 276', weight: 1.0 },
  ],

  // ==================== CONTRIBUTION DES PATENTES (Art. 277-314) ====================

  'patente': [
    { article: 'Art. 277', weight: 1.0 },
    { article: 'Art. 278', weight: 0.9 },
    { article: 'Art. 314', weight: 0.9 },
  ],
  'contribution patentes': [
    { article: 'Art. 277', weight: 1.0 },
  ],
  'droit patente': [
    { article: 'Art. 277', weight: 1.0 },
  ],
  'activité commerciale': [
    { article: 'Art. 277', weight: 0.9 },
  ],
  'activité industrielle': [
    { article: 'Art. 277', weight: 0.9 },
  ],
  'profession': [
    { article: 'Art. 277', weight: 0.8 },
  ],

  // Assiette patente
  'chiffre affaires patente': [
    { article: 'Art. 278', weight: 1.0 },
  ],
  'ca patente': [
    { article: 'Art. 278', weight: 1.0 },
  ],
  'assiette patente': [
    { article: 'Art. 278', weight: 1.0 },
  ],

  // Exemptions patente
  'exemption patente': [
    { article: 'Art. 279', weight: 1.0 },
  ],
  'exonération patente': [
    { article: 'Art. 279', weight: 1.0 },
  ],
  'artistes': [
    { article: 'Art. 279', weight: 0.9 },
  ],
  'peintres': [
    { article: 'Art. 279', weight: 0.9 },
  ],
  'sculpteurs': [
    { article: 'Art. 279', weight: 0.9 },
  ],
  'graveurs': [
    { article: 'Art. 279', weight: 0.9 },
  ],
  'pêcheurs': [
    { article: 'Art. 279', weight: 0.9 },
  ],
  'piroguiers': [
    { article: 'Art. 279', weight: 0.9 },
  ],
  'caisses épargne': [
    { article: 'Art. 279', weight: 0.9 },
  ],
  'mutuelles': [
    { article: 'Art. 279', weight: 0.9 },
  ],
  'ouvriers': [
    { article: 'Art. 279', weight: 0.8 },
  ],
  'couturiers': [
    { article: 'Art. 279', weight: 0.9 },
  ],
  'économats': [
    { article: 'Art. 279', weight: 0.9 },
  ],
  'coopératives': [
    { article: 'Art. 279', weight: 0.9 },
  ],

  // Entités fiscales et titre
  'entité fiscale': [
    { article: 'Art. 281', weight: 1.0 },
  ],
  'établissement': [
    { article: 'Art. 281', weight: 0.9 },
  ],
  'succursale': [
    { article: 'Art. 281', weight: 0.9 },
  ],
  'titre patente': [
    { article: 'Art. 282', weight: 1.0 },
  ],
  'affichage patente': [
    { article: 'Art. 285', weight: 1.0 },
  ],
  'début activité': [
    { article: 'Art. 287', weight: 1.0 },
  ],
  'cessation activité': [
    { article: 'Art. 289', weight: 1.0 },
  ],
  'transfert établissement': [
    { article: 'Art. 290', weight: 1.0 },
  ],
  'annuité patente': [
    { article: 'Art. 287', weight: 0.9 },
  ],

  // Sociétés spéciales
  'sociétés étrangères': [
    { article: 'Art. 294', weight: 1.0 },
  ],
  'marchés publics sociétés': [
    { article: 'Art. 294', weight: 0.9 },
  ],
  '15 jours début activité': [
    { article: 'Art. 294', weight: 1.0 },
  ],
  'patente provisoire': [
    { article: 'Art. 294', weight: 0.9 },
  ],
  'ambulants': [
    { article: 'Art. 295', weight: 1.0 },
  ],
  'marchands ambulants': [
    { article: 'Art. 295', weight: 1.0 },
  ],
  'forains': [
    { article: 'Art. 295', weight: 0.9 },
  ],
  'transporteurs': [
    { article: 'Art. 296', weight: 1.0 },
  ],
  'transporteurs fluviaux': [
    { article: 'Art. 296', weight: 1.0 },
  ],
  'sociétés pétrolières': [
    { article: 'Art. 297', weight: 1.0 },
  ],
  '50% droits': [
    { article: 'Art. 297', weight: 1.0 },
  ],

  // Matrices et paiement
  'matrices patente': [
    { article: 'Art. 301', weight: 1.0 },
    { article: 'Art. 302', weight: 0.9 },
  ],
  'rôle patente': [
    { article: 'Art. 303', weight: 1.0 },
  ],
  'titre perception': [
    { article: 'Art. 304', weight: 1.0 },
  ],
  'paiement patente': [
    { article: 'Art. 305', weight: 1.0 },
  ],
  '10-20 avril': [
    { article: 'Art. 305', weight: 1.0 },
  ],
  'paiement fractionné': [
    { article: 'Art. 305', weight: 0.9 },
  ],
  '100 000 fcfa': [
    { article: 'Art. 305', weight: 0.9 },
  ],
  'retard paiement patente': [
    { article: 'Art. 306', weight: 1.0 },
  ],
  '100% pénalité': [
    { article: 'Art. 306', weight: 1.0 },
  ],
  'stand-by': [
    { article: 'Art. 307', weight: 1.0 },
  ],
  'stand by': [
    { article: 'Art. 307', weight: 1.0 },
  ],
  '25% stand-by': [
    { article: 'Art. 307', weight: 1.0 },
  ],
  'activité intermittente': [
    { article: 'Art. 307', weight: 0.9 },
  ],
  'déclaration patente': [
    { article: 'Art. 308', weight: 1.0 },
    { article: 'Art. 309', weight: 0.9 },
    { article: 'Art. 312', weight: 0.8 },
  ],
  'contrôle patente': [
    { article: 'Art. 310', weight: 1.0 },
  ],
  'entrepôt': [
    { article: 'Art. 311', weight: 1.0 },
  ],
  '500 000 fcfa amende': [
    { article: 'Art. 311', weight: 1.0 },
  ],
  'déclaration ca': [
    { article: 'Art. 312', weight: 1.0 },
  ],
  '30 avril': [
    { article: 'Art. 312', weight: 1.0 },
  ],
  'sanctions patente': [
    { article: 'Art. 313', weight: 1.0 },
  ],

  // Barème patente
  'barème patente': [
    { article: 'Art. 314', weight: 1.0 },
  ],
  'tarif patente': [
    { article: 'Art. 314', weight: 1.0 },
  ],
  'taux patente': [
    { article: 'Art. 314', weight: 1.0 },
  ],
  '0,750%': [
    { article: 'Art. 314', weight: 1.0 },
  ],
  '0,650%': [
    { article: 'Art. 314', weight: 1.0 },
  ],
  '0,450%': [
    { article: 'Art. 314', weight: 1.0 },
  ],
  '0,200%': [
    { article: 'Art. 314', weight: 1.0 },
  ],
  '0,150%': [
    { article: 'Art. 314', weight: 1.0 },
  ],
  '0,140%': [
    { article: 'Art. 314', weight: 1.0 },
  ],
  '0,135%': [
    { article: 'Art. 314', weight: 1.0 },
  ],
  '0,125%': [
    { article: 'Art. 314', weight: 1.0 },
  ],
  '0,045%': [
    { article: 'Art. 314', weight: 1.0 },
  ],
  '10 000 fcfa minimum': [
    { article: 'Art. 314', weight: 1.0 },
  ],
  'minimum forfaitaire': [
    { article: 'Art. 314', weight: 0.9 },
  ],
  'progressif patente': [
    { article: 'Art. 314', weight: 0.9 },
  ],
  '20 millions': [
    { article: 'Art. 314', weight: 0.8 },
  ],
  '40 millions': [
    { article: 'Art. 314', weight: 0.8 },
  ],
  '100 millions': [
    { article: 'Art. 314', weight: 0.8 },
  ],
  '300 millions': [
    { article: 'Art. 314', weight: 0.8 },
  ],
  '500 millions': [
    { article: 'Art. 314', weight: 0.8 },
  ],
  '1 milliard': [
    { article: 'Art. 314', weight: 0.8 },
  ],
  '3 milliards': [
    { article: 'Art. 314', weight: 0.8 },
  ],
  '20 milliards': [
    { article: 'Art. 314', weight: 0.8 },
  ],

  // ==================== TAXE RÉGIONALE (Art. 321-327) ====================

  'taxe régionale': [
    { article: 'Art. 321', weight: 1.0 },
    { article: 'Art. 322', weight: 0.9 },
    { article: 'Art. 326', weight: 0.8 },
  ],
  'taxe regionale': [
    { article: 'Art. 321', weight: 1.0 },
    { article: 'Art. 322', weight: 0.9 },
  ],
  'personnes physiques': [
    { article: 'Art. 321', weight: 0.9 },
  ],
  '18 ans': [
    { article: 'Art. 321', weight: 1.0 },
  ],
  'âge minimum': [
    { article: 'Art. 321', weight: 0.9 },
  ],
  'résidence': [
    { article: 'Art. 322', weight: 0.9 },
  ],
  'exemption taxe régionale': [
    { article: 'Art. 323', weight: 1.0 },
  ],
  'diplomates': [
    { article: 'Art. 323', weight: 0.9 },
  ],
  'aveugles': [
    { article: 'Art. 323', weight: 0.9 },
  ],
  'mutilés guerre': [
    { article: 'Art. 323', weight: 0.9 },
  ],
  'indigents': [
    { article: 'Art. 323', weight: 0.9 },
  ],
  'recouvrement taxe régionale': [
    { article: 'Art. 324', weight: 1.0 },
  ],
  'rôle nominatif': [
    { article: 'Art. 324', weight: 0.9 },
  ],
  '120 000 fcfa': [
    { article: 'Art. 324', weight: 1.0 },
  ],
  'précompte employeur': [
    { article: 'Art. 325', weight: 1.0 },
  ],
  'précompte janvier': [
    { article: 'Art. 325', weight: 1.0 },
  ],
  'tarif taxe régionale': [
    { article: 'Art. 326', weight: 1.0 },
  ],
  'paiement taxe régionale': [
    { article: 'Art. 327', weight: 1.0 },
  ],

  // ==================== TAXE SUR LES SPECTACLES (Art. 331-340 bis) ====================

  'taxe spectacles': [
    { article: 'Art. 331', weight: 1.0 },
    { article: 'Art. 333', weight: 0.9 },
  ],
  'taxe sur les spectacles': [
    { article: 'Art. 331', weight: 1.0 },
  ],
  'spectacles': [
    { article: 'Art. 331', weight: 1.0 },
    { article: 'Art. 332', weight: 0.9 },
  ],
  'jeux': [
    { article: 'Art. 331', weight: 0.9 },
  ],
  'divertissements': [
    { article: 'Art. 331', weight: 0.9 },
  ],
  'exemption spectacles': [
    { article: 'Art. 332', weight: 1.0 },
  ],
  'manifestations sportives': [
    { article: 'Art. 332', weight: 0.9 },
  ],
  'spectacles éducatifs': [
    { article: 'Art. 332', weight: 0.9 },
  ],
  'fêtes patronales': [
    { article: 'Art. 332', weight: 0.9 },
  ],
  'tarif spectacles': [
    { article: 'Art. 333', weight: 1.0 },
  ],
  '15%': [
    { article: 'Art. 333', weight: 0.9 },
  ],
  '30%': [
    { article: 'Art. 333', weight: 0.9 },
  ],
  '200 fcfa entrée': [
    { article: 'Art. 333', weight: 1.0 },
  ],
  'bar dancing': [
    { article: 'Art. 334', weight: 1.0 },
  ],
  'bars dancings': [
    { article: 'Art. 334', weight: 1.0 },
  ],
  'bar-dancing': [
    { article: 'Art. 334', weight: 1.0 },
  ],
  'dancing': [
    { article: 'Art. 334', weight: 1.0 },
  ],
  'musiciens': [
    { article: 'Art. 334', weight: 0.9 },
  ],
  'pick-up': [
    { article: 'Art. 334', weight: 0.9 },
  ],
  'pickup': [
    { article: 'Art. 334', weight: 0.9 },
  ],
  '240 000 fcfa': [
    { article: 'Art. 334', weight: 1.0 },
  ],
  '100 000 fcfa pickup': [
    { article: 'Art. 334', weight: 1.0 },
  ],
  '120 000 fcfa non permanent': [
    { article: 'Art. 334', weight: 0.9 },
  ],
  '50 000 fcfa': [
    { article: 'Art. 334', weight: 0.9 },
  ],
  'permanent': [
    { article: 'Art. 334', weight: 0.8 },
  ],
  'non permanent': [
    { article: 'Art. 334', weight: 0.8 },
  ],
  'salle bal': [
    { article: 'Art. 335', weight: 1.0 },
  ],
  '4 000 fcfa bal': [
    { article: 'Art. 335', weight: 1.0 },
  ],
  'cercles privés': [
    { article: 'Art. 336', weight: 1.0 },
  ],
  '10% recettes': [
    { article: 'Art. 336', weight: 1.0 },
  ],
  'appareils jeux': [
    { article: 'Art. 337', weight: 1.0 },
  ],
  'baby-foot': [
    { article: 'Art. 337', weight: 0.9 },
  ],
  'billard': [
    { article: 'Art. 337', weight: 0.9 },
  ],
  'déclaration spectacles': [
    { article: 'Art. 340', weight: 1.0 },
    { article: 'Art. 340 bis', weight: 0.9 },
  ],
  '24h avant': [
    { article: 'Art. 340', weight: 1.0 },
  ],
  'relevé recettes': [
    { article: 'Art. 340', weight: 0.9 },
  ],
  '15 jours du mois': [
    { article: 'Art. 340', weight: 0.9 },
  ],
  'spectacle occasionnel': [
    { article: 'Art. 340', weight: 0.9 },
  ],
  '3 jours après': [
    { article: 'Art. 340', weight: 0.9 },
  ],
  'billets entrée': [
    { article: 'Art. 338', weight: 1.0 },
  ],
  'tickets spectacles': [
    { article: 'Art. 338', weight: 0.9 },
  ],
  'paiement spectacles': [
    { article: 'Art. 339', weight: 1.0 },
  ],
};

/**
 * Synonymes fiscaux pour l'expansion des requêtes - Impôts Locaux
 */
export const SYNONYMS_IL: Record<string, string[]> = {
  'cfpb': ['contribution foncière propriétés bâties', 'foncier bâti', 'impôt foncier bâti', 'impôt immobilier'],
  'cfpnb': ['contribution foncière propriétés non bâties', 'foncier non bâti', 'impôt foncier non bâti', 'impôt terrain'],
  'patente': ['contribution des patentes', 'droit de patente', 'impôt activité'],
  'taxe régionale': ['impôt régional', 'taxe locale'],
  'taxe spectacles': ['taxe divertissements', 'taxe jeux', 'impôt spectacles'],
  'valeur locative': ['revenu cadastral', 'base foncière'],
  'exemption': ['exonération', 'dispense', 'franchise'],
  'immeuble': ['propriété bâtie', 'construction', 'bâtiment'],
  'terrain': ['propriété non bâtie', 'sol', 'fonds de terre'],
  'bar dancing': ['dancing', 'discothèque', 'boîte de nuit'],
};

/**
 * Trouve les articles pertinents pour une requête Impôts Locaux
 */
export function findArticlesForQueryIL(query: string): string[] {
  const normalizedQuery = query.toLowerCase();
  const articlesFound = new Map<string, number>();

  // Recherche directe dans les mots-clés
  for (const [keyword, articles] of Object.entries(KEYWORD_ARTICLE_MAP_IL)) {
    if (normalizedQuery.includes(keyword.toLowerCase())) {
      for (const { article, weight } of articles) {
        const current = articlesFound.get(article) || 0;
        articlesFound.set(article, Math.max(current, weight));
      }
    }
  }

  // Expansion par synonymes
  for (const [term, synonyms] of Object.entries(SYNONYMS_IL)) {
    if (normalizedQuery.includes(term) || synonyms.some(s => normalizedQuery.includes(s.toLowerCase()))) {
      const articles = KEYWORD_ARTICLE_MAP_IL[term];
      if (articles) {
        for (const { article, weight } of articles) {
          const current = articlesFound.get(article) || 0;
          articlesFound.set(article, Math.max(current, weight * 0.9));
        }
      }
    }
  }

  // Tri par poids décroissant et retour
  return [...articlesFound.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([article]) => article);
}
