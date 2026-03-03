/**
 * Service IBA — Impôt sur les Bénéfices d'Affaires
 * Art. 93-102 CGI Congo 2026
 */

export type RegimeIBA = "reel" | "forfait";

export interface IbaInput {
  chiffreAffaires: number;
  chargesDeductibles: number;
  regime: RegimeIBA;
}

export interface IbaResult {
  chiffreAffaires: number;
  chargesDeductibles: number;
  regime: RegimeIBA;
  beneficeImposable: number;
  taux: number;
  impot: number;
  beneficeNet: number;
}

const TAUX_IBA_REEL = 0.30;

// Barème forfaitaire IBA (Art. 96-101)
const FORFAIT_TRANCHES = [
  { min: 0, max: 10_000_000, taux: 0.08 },
  { min: 10_000_000, max: 30_000_000, taux: 0.06 },
  { min: 30_000_000, max: 100_000_000, taux: 0.04 },
  { min: 100_000_000, max: null, taux: 0.03 },
];

export function calculerIBA(input: IbaInput): IbaResult {
  const ca = input.chiffreAffaires || 0;
  const charges = input.chargesDeductibles || 0;

  let beneficeImposable: number;
  let taux: number;
  let impot: number;

  if (input.regime === "reel") {
    beneficeImposable = Math.max(0, ca - charges);
    taux = TAUX_IBA_REEL * 100;
    impot = Math.round(beneficeImposable * TAUX_IBA_REEL);
  } else {
    // Forfait : barème progressif sur CA
    beneficeImposable = ca; // base = CA pour le forfait
    taux = 0;
    impot = 0;
    let caRestant = ca;
    for (const tranche of FORFAIT_TRANCHES) {
      if (caRestant <= 0) break;
      const limiteHaute = tranche.max ?? Infinity;
      const largeur = limiteHaute - tranche.min;
      const base = Math.min(caRestant, largeur);
      impot += Math.round(base * tranche.taux);
      caRestant -= base;
    }
    taux = ca > 0 ? Math.round((impot / ca) * 10000) / 100 : 0;
  }

  return {
    chiffreAffaires: ca,
    chargesDeductibles: charges,
    regime: input.regime,
    beneficeImposable,
    taux,
    impot,
    beneficeNet: beneficeImposable - impot,
  };
}
