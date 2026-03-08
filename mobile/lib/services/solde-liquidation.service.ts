/**
 * Service Solde de Liquidation de l'IS
 * Art. 86-A, 86-C, 86-G CGI Congo 2026
 *
 * Résultat fiscal :
 *   RC = Produits − Charges
 *   RF = RC + Réintégrations − Déductions − ARD − Report déficitaire
 *
 * Taux IS (Art. 86-A) :
 *  - 28% taux général
 *  - 25% microfinance, enseignement privé
 *  - 28% mines, carrières, exploitation immobilière
 *
 * Fraction du bénéfice < 1 000 FCFA négligée (Art. 86-A §1).
 * Solde = IS calculé − acomptes déjà versés (minimum de perception).
 */

export type TypeContribuable =
  | "general"
  | "microfinance"
  | "mines";

export interface SoldeLiquidationInput {
  // Éléments du résultat fiscal
  produitsExploitation: number;
  produitsFinanciers: number;
  produitsHAO: number;
  charges: number;
  reintegrations: number;
  deductions: number;
  ard: number;
  reportDeficitaire: number;

  typeContribuable: TypeContribuable;
  acompte1: number;
  acompte2: number;
  acompte3: number;
  acompte4: number;
}

export interface SoldeLiquidationResult {
  // Résultat comptable
  totalProduits: number;
  charges: number;
  resultatComptable: number;

  // Résultat fiscal
  reintegrations: number;
  deductions: number;
  ard: number;
  reportDeficitaire: number;
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
  const prodExpl = Math.max(0, input.produitsExploitation || 0);
  const prodFin = Math.max(0, input.produitsFinanciers || 0);
  const prodHAO = Math.max(0, input.produitsHAO || 0);
  const totalProduits = prodExpl + prodFin + prodHAO;
  const charges = Math.max(0, input.charges || 0);
  const reintegrations = Math.max(0, input.reintegrations || 0);
  const deductions = Math.max(0, input.deductions || 0);
  const ard = Math.max(0, input.ard || 0);
  const reportDeficitaire = Math.max(0, input.reportDeficitaire || 0);

  // RC = Produits − Charges
  const resultatComptable = totalProduits - charges;

  // RF = RC + Réintégrations − Déductions − ARD − Report déficitaire
  const resultatFiscal = Math.max(0, resultatComptable + reintegrations - deductions - ard - reportDeficitaire);

  // Art. 86-A §1 : fraction < 1 000 FCFA négligée
  const beneficeArrondi = Math.floor(resultatFiscal / 1000) * 1000;

  const tauxIS = TAUX_IS[input.typeContribuable] || TAUX_IS.general;
  const isCalcule = beneficeArrondi * tauxIS;

  const acomptes = [
    { label: "1er trimestre (15 mars)", montant: input.acompte1 || 0 },
    { label: "2e trimestre (15 juin)", montant: input.acompte2 || 0 },
    { label: "3e trimestre (15 sept.)", montant: input.acompte3 || 0 },
    { label: "4e trimestre (15 déc.)", montant: input.acompte4 || 0 },
  ];

  const totalAcomptes = acomptes.reduce((s, a) => s + a.montant, 0);
  const solde = isCalcule - totalAcomptes;

  return {
    totalProduits: Math.round(totalProduits),
    charges: Math.round(charges),
    resultatComptable: Math.round(resultatComptable),
    reintegrations: Math.round(reintegrations),
    deductions: Math.round(deductions),
    ard: Math.round(ard),
    reportDeficitaire: Math.round(reportDeficitaire),
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
