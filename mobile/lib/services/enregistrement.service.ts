/**
 * Service Droits d'enregistrement
 * Tome 2, Livre 1, Chapitre 11 — CGI Congo 2026
 */

export type TypeActe =
  | "contrat"
  | "marchePublic"
  | "bail"
  | "bailIllimite"
  | "cessionBail"
  | "mutationImmo"
  | "mutationImmoImmat"
  | "fondsCommerce"
  | "cessionActions"
  | "venteMobiliere"
  | "partage";

export type ZoneImmat = "centreVille" | "urbainRural";

export interface EnregistrementInput {
  typeActe: TypeActe;
  montant: number;
  zoneImmat?: ZoneImmat;
}

export interface EnregistrementResult {
  typeActe: TypeActe;
  montant: number;
  taux: number;
  articleRef: string;
  libelle: string;
  droits: number;
  centimesAdditionnels: number;
  total: number;
}

interface TauxConfig {
  taux: number;
  article: string;
  libelle: string;
}

const TAUX_ACTES: Record<TypeActe, TauxConfig> = {
  contrat: { taux: 0.01, article: "Art. 236-237", libelle: "Contrats / marchés privés" },
  marchePublic: { taux: 0.02, article: "Art. 235", libelle: "Marchés publics" },
  bail: { taux: 0.03, article: "Art. 216", libelle: "Baux immobiliers" },
  bailIllimite: { taux: 0.04, article: "Art. 217", libelle: "Baux durée illimitée" },
  cessionBail: { taux: 0.10, article: "Art. 218", libelle: "Cession de droit au bail" },
  mutationImmo: { taux: 0.08, article: "Art. 263", libelle: "Mutations immobilières" },
  mutationImmoImmat: { taux: 0.03, article: "Art. 263 bis", libelle: "Mutations immatriculation" },
  fondsCommerce: { taux: 0.10, article: "Art. 225", libelle: "Fonds de commerce" },
  cessionActions: { taux: 0.05, article: "Art. 214", libelle: "Cessions d'actions" },
  venteMobiliere: { taux: 0.04, article: "Art. 265", libelle: "Ventes mobilières" },
  partage: { taux: 0.01, article: "Art. 255", libelle: "Partages de biens" },
};

const TAUX_CENTIMES = 0.05; // 5% des droits (Art. 216 bis)

export function calculerEnregistrement(input: EnregistrementInput): EnregistrementResult {
  const montant = Math.max(0, input.montant || 0);
  const config = { ...TAUX_ACTES[input.typeActe] };

  // Zone immatriculation pour mutations immobilières
  if (input.typeActe === "mutationImmoImmat" && input.zoneImmat === "urbainRural") {
    config.taux = 0.02;
    config.libelle = "Mutations immatriculation (urbain/rural)";
  }

  const droits = Math.max(Math.round(montant * config.taux), input.typeActe === "mutationImmoImmat" ? 10_000 : 0);
  const centimesAdditionnels = Math.round(droits * TAUX_CENTIMES);
  const total = droits + centimesAdditionnels;

  return {
    typeActe: input.typeActe,
    montant,
    taux: config.taux * 100,
    articleRef: config.article,
    libelle: config.libelle,
    droits,
    centimesAdditionnels,
    total,
  };
}
