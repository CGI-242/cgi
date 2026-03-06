/**
 * Service IGF — Impôt Global Forfaitaire
 * Art. 96-101 CGI Congo 2026
 * Pour les petites et très petites entreprises (CA < seuil TVA)
 */

export type TypeActiviteIGF = "commerce" | "services" | "artisanat";

export interface IgfInput {
  chiffreAffaires: number;
  typeActivite: TypeActiviteIGF;
}

export interface IgfTrancheDetail {
  tranche: string;
  base: number;
  taux: number;
  montant: number;
}

export interface IgfResult {
  chiffreAffaires: number;
  typeActivite: TypeActiviteIGF;
  igfAnnuel: number;
  igfTrimestriel: number;
  tranches: IgfTrancheDetail[];
}

// Barème IGF par tranches de CA (Art. 98-101)
// TODO: Vérifier la conformité de ce barème progressif avec le CGI 2026.
// L'Art. 5 du texte IGF (TFNC4) fixe un taux unique de 5% du CA HT (ou 8% de la marge).
// Le barème ci-dessous est un barème progressif couramment appliqué en pratique.
const BAREME_IGF = [
  { min: 0, max: 1_000_000, taux: 0.05 },
  { min: 1_000_000, max: 3_000_000, taux: 0.04 },
  { min: 3_000_000, max: 5_000_000, taux: 0.035 },
  { min: 5_000_000, max: 10_000_000, taux: 0.03 },
  { min: 10_000_000, max: 30_000_000, taux: 0.025 },
  { min: 30_000_000, max: 60_000_000, taux: 0.02 },
  { min: 60_000_000, max: null, taux: 0.015 },
];

export function calculerIGF(input: IgfInput): IgfResult {
  const ca = Math.max(0, input.chiffreAffaires || 0);
  let igfAnnuel = 0;
  let caRestant = ca;
  const tranches: IgfTrancheDetail[] = [];

  for (const tranche of BAREME_IGF) {
    if (caRestant <= 0) break;
    const limiteHaute = tranche.max ?? Infinity;
    const largeur = limiteHaute - tranche.min;
    const base = Math.min(caRestant, largeur);
    const montant = Math.round(base * tranche.taux);

    tranches.push({
      tranche: tranche.max
        ? `${formatM(tranche.min)} - ${formatM(tranche.max)}`
        : `> ${formatM(tranche.min)}`,
      base,
      taux: tranche.taux * 100,
      montant,
    });

    igfAnnuel += montant;
    caRestant -= base;
  }

  return {
    chiffreAffaires: ca,
    typeActivite: input.typeActivite,
    igfAnnuel,
    igfTrimestriel: Math.round(igfAnnuel / 4),
    tranches,
  };
}

function formatM(n: number): string {
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1_000) return `${n / 1_000}K`;
  return String(n);
}
