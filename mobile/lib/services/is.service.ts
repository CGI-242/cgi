/**
 * Service Minimum de Perception — IS & IBA
 * Art. 86-C CGI 2026 (IS) / Art. 95 CGI 2026 (IBA)
 *
 * IS  : taux 1% (Art. 86-C §3), base = produits − retenues libératoires
 * IBA : taux 1,5% (Art. 95 §4), base = produits (pas de retenues libératoires)
 *
 * Art. 95 §6 : le minimum IBA suit les mêmes dispositions que l'IS
 * → 4 acomptes trimestriels : 15 mars, 15 juin, 15 sept., 15 déc.
 */

export type TypeImpot = "is" | "iba";

export interface MinPerceptionInput {
  typeImpot: TypeImpot;
  produitsExploitation: number | null;
  produitsFinanciers: number | null;
  produitsHAO: number | null;
  retenuesLiberatoires: number | null; // IS uniquement
}

export interface MinPerceptionResult {
  typeImpot: TypeImpot;
  baseMinimumPerception: number;
  tauxMinimum: number;
  minimumPerceptionAnnuel: number;
  acompteTrimestriel: number;
  acomptes: { label: string; montant: number }[];
}

// Art. 86-C §3 : IS = 1%
const TAUX_MINIMUM_IS = 0.01;

// Art. 95 §4 : IBA = 1,5%
const TAUX_MINIMUM_IBA = 0.015;

export function calculerMinPerception(input: MinPerceptionInput): MinPerceptionResult {
  const produitsExploitation = Math.max(0, input.produitsExploitation || 0);
  const produitsFinanciers = Math.max(0, input.produitsFinanciers || 0);
  const produitsHAO = Math.max(0, input.produitsHAO || 0);
  const retenuesLiberatoires = Math.max(0, input.retenuesLiberatoires || 0);

  const taux = input.typeImpot === "is" ? TAUX_MINIMUM_IS : TAUX_MINIMUM_IBA;

  // IS : base = produits − retenues libératoires (Art. 86-C §2)
  // IBA : base = produits (Art. 95 §4)
  const baseMinimumPerception = input.typeImpot === "is"
    ? produitsExploitation + produitsFinanciers + produitsHAO - retenuesLiberatoires
    : produitsExploitation + produitsFinanciers + produitsHAO;

  const minimumPerceptionAnnuel = Math.max(0, baseMinimumPerception * taux);
  const acompteTrimestriel = minimumPerceptionAnnuel / 4;

  const acomptes = [
    { label: "1er trimestre (15 mars)", montant: Math.round(acompteTrimestriel) },
    { label: "2e trimestre (15 juin)", montant: Math.round(acompteTrimestriel) },
    { label: "3e trimestre (15 sept.)", montant: Math.round(acompteTrimestriel) },
    { label: "4e trimestre (15 déc.)", montant: Math.round(acompteTrimestriel) },
  ];

  return {
    typeImpot: input.typeImpot,
    baseMinimumPerception: Math.round(baseMinimumPerception),
    tauxMinimum: taux * 100,
    minimumPerceptionAnnuel: Math.round(minimumPerceptionAnnuel),
    acompteTrimestriel: Math.round(acompteTrimestriel),
    acomptes,
  };
}

// Rétro-compatibilité
export type IsInput = Omit<MinPerceptionInput, "typeImpot">;
export type IsResult = Omit<MinPerceptionResult, "typeImpot">;

export function calculerIS(input: IsInput): IsResult {
  const result = calculerMinPerception({ ...input, typeImpot: "is" });
  const { typeImpot, ...rest } = result;
  return rest;
}
