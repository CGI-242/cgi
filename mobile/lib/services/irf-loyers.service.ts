/**
 * Service IRF Loyers — Impôt sur les Revenus Fonciers (Loyers)
 * Art. 111-113A CGI Congo 2026
 */

export type TypeLocataire = "personneMorale" | "personnePhysique";

export interface IrfLoyersInput {
  loyersBrutsAnnuels: number;
  typeLocataire: TypeLocataire;
}

export interface IrfLoyersResult {
  loyersBrutsAnnuels: number;
  loyersBrutsMensuels: number;
  typeLocataire: TypeLocataire;
  taux: number;
  impotAnnuel: number;
  impotMensuel: number;
  netAnnuel: number;
  netMensuel: number;
  echeance: string;
}

const TAUX_IRF_LOYERS = 0.09;

export function calculerIRFLoyers(input: IrfLoyersInput): IrfLoyersResult {
  const loyersBrutsAnnuels = Math.max(0, input.loyersBrutsAnnuels || 0);
  const loyersBrutsMensuels = Math.round(loyersBrutsAnnuels / 12);
  const impotAnnuel = Math.round(loyersBrutsAnnuels * TAUX_IRF_LOYERS);
  const impotMensuel = Math.round(impotAnnuel / 12);
  const netAnnuel = loyersBrutsAnnuels - impotAnnuel;
  const netMensuel = Math.round(netAnnuel / 12);

  const echeance =
    input.typeLocataire === "personneMorale"
      ? "15 mars (Art. 113A)"
      : "15 mai, 20 août, 15 novembre (Art. 113A)";

  return {
    loyersBrutsAnnuels,
    loyersBrutsMensuels,
    typeLocataire: input.typeLocataire,
    taux: TAUX_IRF_LOYERS * 100,
    impotAnnuel,
    impotMensuel,
    netAnnuel,
    netMensuel,
    echeance,
  };
}
