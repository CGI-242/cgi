/**
 * Service IGF — Impôt Global Forfaitaire
 * Art. 5 §5 du texte IGF (TFNC4), CGI Congo 2026
 *
 * Taux unique :
 *   - 5% du chiffre d'affaires annuel HT
 *   - 8% de la marge globale annuelle HT (activités à prix réglementé)
 *
 * Paiement trimestriel (Art. 3bis) : 4 versements égaux.
 */

export type BaseIGF = "ca" | "marge";

export interface IgfInput {
  chiffreAffaires: number;
  baseImposition: BaseIGF;
}

export interface IgfResult {
  baseImposable: number;
  baseImposition: BaseIGF;
  taux: number;
  igfAnnuel: number;
  igfTrimestriel: number;
}

// Art. 5 §5 : taux fixés par le texte IGF
const TAUX_CA = 0.05;    // 5% du CA HT
const TAUX_MARGE = 0.08; // 8% de la marge globale HT

export function calculerIGF(input: IgfInput): IgfResult {
  const base = Math.max(0, input.chiffreAffaires || 0);
  const taux = input.baseImposition === "marge" ? TAUX_MARGE : TAUX_CA;
  const igfAnnuel = Math.round(base * taux);

  return {
    baseImposable: base,
    baseImposition: input.baseImposition,
    taux: taux * 100,
    igfAnnuel,
    igfTrimestriel: Math.round(igfAnnuel / 4),
  };
}
