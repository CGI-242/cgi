/**
 * Service Solde de Liquidation de l'IS
 * Art. 86A, 86C, 86G CGI Congo 2026
 *
 * Taux IS (Art. 86A) :
 *  - 28% taux general
 *  - 25% microfinance, enseignement prive
 *  - 28% mines, carrieres, exploitation immobiliere
 *  (Les PM étrangères non-résidentes relèvent du régime forfaitaire Art. 92+)
 *
 * Fraction du benefice < 1 000 FCFA negligee.
 * Le solde = IS calcule - acomptes deja verses (minimum de perception).
 */

export type TypeContribuable =
  | "general"
  | "microfinance"
  | "mines";

export interface SoldeLiquidationInput {
  resultatFiscal: number;
  typeContribuable: TypeContribuable;
  acompte1: number;
  acompte2: number;
  acompte3: number;
  acompte4: number;
}

export interface SoldeLiquidationResult {
  resultatFiscal: number;
  beneficeArrondi: number;
  tauxIS: number;
  isCalcule: number;
  totalAcomptes: number;
  solde: number;
  creditImpot: boolean;
  detailAcomptes: { label: string; montant: number }[];
}

const TAUX_IS: Record<TypeContribuable, number> = {
  general: 0.28,
  microfinance: 0.25,
  mines: 0.28,
};

export function calculerSoldeLiquidation(
  input: SoldeLiquidationInput
): SoldeLiquidationResult {
  const resultatFiscal = Math.max(0, input.resultatFiscal || 0);

  // Art. 86A-1 : fraction < 1 000 FCFA negligee
  const beneficeArrondi = Math.floor(resultatFiscal / 1000) * 1000;

  const tauxIS = TAUX_IS[input.typeContribuable] || TAUX_IS.general;
  const isCalcule = beneficeArrondi * tauxIS;

  const acomptes = [
    { label: "1er trimestre (15 mars)", montant: input.acompte1 || 0 },
    { label: "2e trimestre (15 juin)", montant: input.acompte2 || 0 },
    { label: "3e trimestre (15 sept.)", montant: input.acompte3 || 0 },
    { label: "4e trimestre (15 dec.)", montant: input.acompte4 || 0 },
  ];

  const totalAcomptes = acomptes.reduce((s, a) => s + a.montant, 0);
  const solde = isCalcule - totalAcomptes;

  return {
    resultatFiscal: Math.round(resultatFiscal),
    beneficeArrondi,
    tauxIS: Math.round(tauxIS * 100),
    isCalcule: Math.round(isCalcule),
    totalAcomptes: Math.round(totalAcomptes),
    solde: Math.round(solde),
    creditImpot: solde < 0,
    detailAcomptes: acomptes.map((a) => ({
      label: a.label,
      montant: Math.round(a.montant),
    })),
  };
}
