/**
 * Service IRCM — Impôt sur le Revenu des Capitaux Mobiliers
 * Art. 103-110A CGI Congo 2026
 */

export type TypeRevenuIRCM = "dividendes" | "interets" | "plusValues";

export interface IrcmInput {
  montantBrut: number;
  typeRevenu: TypeRevenuIRCM;
}

export interface IrcmResult {
  montantBrut: number;
  typeRevenu: TypeRevenuIRCM;
  taux: number;
  impot: number;
  montantNet: number;
}

const TAUX_IRCM: Record<TypeRevenuIRCM, number> = {
  dividendes: 0.15,
  interets: 0.15,
  plusValues: 0.10,
};

export function calculerIRCM(input: IrcmInput): IrcmResult {
  const montantBrut = input.montantBrut || 0;
  const taux = TAUX_IRCM[input.typeRevenu];
  const impot = Math.round(montantBrut * taux);
  const montantNet = montantBrut - impot;

  return {
    montantBrut,
    typeRevenu: input.typeRevenu,
    taux: taux * 100,
    impot,
    montantNet,
  };
}
