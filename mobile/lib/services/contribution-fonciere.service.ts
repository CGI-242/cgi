/**
 * Service Contribution Foncière (CFPB / CFPNB)
 * Art. 251-275 CGI Congo 2026
 */

export type TypePropriete = "bati" | "nonBatiUrbain" | "nonBatiRural";
export type ZoneUrbaine = "zone1" | "zone2" | "zone3" | "zone4";
export type CultureRurale = "cafe_palmier" | "forestier" | "autres_cultures" | "elevage" | "usines_transfo" | "non_mis_valeur";

export interface ContributionFonciereInput {
  typePropriete: TypePropriete;
  // CFPB
  valeurLocative?: number;
  tauxCommunal?: number; // en % (max 20 pour bâti, 40 pour non bâti)
  // CFPNB urbain
  surfaceM2?: number;
  zoneUrbaine?: ZoneUrbaine;
  // CFPNB rural
  surfaceHa?: number;
  cultureRurale?: CultureRurale;
}

export interface ContributionFonciereResult {
  typePropriete: TypePropriete;
  basebrute: number;
  abattement: number;
  tauxAbattement: number;
  baseNette: number;
  tauxCommunal: number;
  tauxMax: number;
  impot: number;
  articleRef: string;
}

// Prix au m² par zone (Art. 270 bis)
const PRIX_M2_ZONE: Record<ZoneUrbaine, number> = {
  zone1: 125,    // Centre-ville communes plein exercice
  zone2: 75,     // Arrondissements, chefs-lieux départements
  zone3: 12.5,   // Chefs-lieux de districts
  zone4: 6.25,   // Autres localités
};

// Forfait par hectare (Art. 272)
const FORFAIT_HA: Record<CultureRurale, number> = {
  cafe_palmier: 2_000,
  forestier: 2_000,
  autres_cultures: 1_000,
  elevage: 600,
  usines_transfo: 600,
  non_mis_valeur: 500,
};

export function calculerContributionFonciere(input: ContributionFonciereInput): ContributionFonciereResult {
  const tauxCommunal = Math.min(
    input.tauxCommunal || 0,
    input.typePropriete === "bati" ? 20 : 40
  );
  const tauxMax = input.typePropriete === "bati" ? 20 : 40;

  let basebrute = 0;
  let abattement = 0;
  let tauxAbattement = 0;
  let articleRef = "";

  if (input.typePropriete === "bati") {
    // CFPB (Art. 257-262)
    basebrute = input.valeurLocative || 0;
    tauxAbattement = 75; // Art. 257 bis
    abattement = Math.round(basebrute * 0.75);
    articleRef = "Art. 257-262";
  } else if (input.typePropriete === "nonBatiUrbain") {
    // CFPNB urbain (Art. 270-275)
    const surface = input.surfaceM2 || 0;
    const prixM2 = PRIX_M2_ZONE[input.zoneUrbaine || "zone1"];
    basebrute = Math.round(surface * prixM2);
    tauxAbattement = 50; // Art. 270
    abattement = Math.round(basebrute * 0.50);
    articleRef = "Art. 270-275";
  } else {
    // CFPNB rural (Art. 272)
    const surfaceHa = input.surfaceHa || 0;
    const forfaitHa = FORFAIT_HA[input.cultureRurale || "autres_cultures"];
    basebrute = Math.round(surfaceHa * forfaitHa);
    tauxAbattement = 0; // Pas d'abattement pour le rural (forfait)
    abattement = 0;
    articleRef = "Art. 272-275";
  }

  const baseNette = basebrute - abattement;
  let impot = Math.round(baseNette * (tauxCommunal / 100));

  // Minimum 1 000 FCFA (Art. 262/275)
  if (impot > 0 && impot < 1_000) {
    impot = 0;
  }

  return {
    typePropriete: input.typePropriete,
    basebrute,
    abattement,
    tauxAbattement,
    baseNette,
    tauxCommunal,
    tauxMax,
    impot,
    articleRef,
  };
}
