/**
 * Service Cessions de parts sociales
 * Art. 214-215 CGI Congo 2026 (Tome 2, Livre 1)
 */

export type TypeCession = "actionsStandard" | "participations" | "changementControle";

export interface CessionPartsInput {
  prixCession: number;
  typeCession: TypeCession;
  contratPetrolier: boolean;
}

export interface CessionPartsResult {
  prixCession: number;
  typeCession: TypeCession;
  taux: number;
  articleRef: string;
  droits: number;
  minimumApplique: boolean;
  centimesAdditionnels: number;
  total: number;
}

const TAUX_CESSION = 0.05; // 5% pour toutes les cessions (Art. 214)
const TAUX_CENTIMES = 0.05; // 5% des droits (Art. 216 bis)
const MINIMUM_PETROLIER = 1_000_000; // Art. 214 bis

export function calculerCessionParts(input: CessionPartsInput): CessionPartsResult {
  const prixCession = input.prixCession || 0;
  let droits = Math.round(prixCession * TAUX_CESSION);
  let minimumApplique = false;

  // Minimum de perception pour contrats pétroliers (Art. 214 bis)
  if (input.contratPetrolier && droits < MINIMUM_PETROLIER) {
    droits = MINIMUM_PETROLIER;
    minimumApplique = true;
  }

  const centimesAdditionnels = Math.round(droits * TAUX_CENTIMES);
  const total = droits + centimesAdditionnels;

  const articleRef =
    input.typeCession === "participations"
      ? "Art. 214 bis"
      : input.typeCession === "changementControle"
      ? "Art. 214 al. 2"
      : "Art. 214";

  return {
    prixCession,
    typeCession: input.typeCession,
    taux: TAUX_CESSION * 100,
    articleRef,
    droits,
    minimumApplique,
    centimesAdditionnels,
    total,
  };
}
