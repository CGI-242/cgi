/**
 * Service TVA — Taxe sur la Valeur Ajoutée
 * TFNC6 Art. 1-40 CGI Congo 2026
 */

export type TypeOperation = "taxable" | "exoneree" | "export";

export interface TvaInput {
  caHT: number;
  achatsHT: number;
  typeOperation: TypeOperation;
}

export interface TvaResult {
  caHT: number;
  achatsHT: number;
  typeOperation: TypeOperation;
  taux: number;
  tvaCollectee: number;
  tvaDeductible: number;
  tvaDue: number;
  creditTva: number;
  montantTTC: number;
}

const TAUX_TVA = 0.18;

export function calculerTVA(input: TvaInput): TvaResult {
  const caHT = Math.max(0, input.caHT || 0);
  const achatsHT = Math.max(0, input.achatsHT || 0);

  let tvaCollectee: number;
  const tvaDeductible = Math.round(achatsHT * TAUX_TVA);

  if (input.typeOperation === "exoneree") {
    tvaCollectee = 0;
  } else if (input.typeOperation === "export") {
    tvaCollectee = 0; // Export = taux 0%, mais TVA déductible maintenue
  } else {
    tvaCollectee = Math.round(caHT * TAUX_TVA);
  }

  const solde = tvaCollectee - tvaDeductible;
  const tvaDue = Math.max(0, solde);
  const creditTva = Math.max(0, -solde);
  const montantTTC = caHT + tvaCollectee;

  return {
    caHT,
    achatsHT,
    typeOperation: input.typeOperation,
    taux: TAUX_TVA * 100,
    tvaCollectee,
    tvaDeductible,
    tvaDue,
    creditTva,
    montantTTC,
  };
}
