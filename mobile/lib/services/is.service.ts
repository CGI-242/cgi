/**
 * Service Minimum de Perception IS
 * Articles 86B et 86C CGI Congo 2026
 *
 * Le minimum de perception est verse en 4 acomptes trimestriels
 * avant meme la liquidation de l'IS sur le resultat fiscal.
 */

export interface IsInput {
  produitsExploitation: number | null;
  produitsFinanciers: number | null;
  produitsHAO: number | null;
  retenuesLiberatoires: number | null;
  deficitConsecutif: boolean;
}

export interface IsResult {
  baseMinimumPerception: number;
  tauxMinimum: number;
  deficitConsecutif: boolean;
  minimumPerceptionAnnuel: number;
  acompteTrimestriel: number;
  acomptes: { label: string; montant: number }[];
}

const TAUX_MINIMUM_NORMAL = 0.01;
const TAUX_MINIMUM_DEFICIT = 0.02;

export function calculerIS(input: IsInput): IsResult {
  const produitsExploitation = input.produitsExploitation || 0;
  const produitsFinanciers = input.produitsFinanciers || 0;
  const produitsHAO = input.produitsHAO || 0;
  const retenuesLiberatoires = input.retenuesLiberatoires || 0;

  const baseMinimumPerception =
    produitsExploitation + produitsFinanciers + produitsHAO - retenuesLiberatoires;

  const tauxMinimum = input.deficitConsecutif ? TAUX_MINIMUM_DEFICIT : TAUX_MINIMUM_NORMAL;

  const minimumPerceptionAnnuel = Math.max(0, baseMinimumPerception * tauxMinimum);
  const acompteTrimestriel = minimumPerceptionAnnuel / 4;

  const acomptes = [
    { label: "1er trimestre (15 mars)", montant: Math.round(acompteTrimestriel) },
    { label: "2e trimestre (15 juin)", montant: Math.round(acompteTrimestriel) },
    { label: "3e trimestre (15 sept.)", montant: Math.round(acompteTrimestriel) },
    { label: "4e trimestre (15 dec.)", montant: Math.round(acompteTrimestriel) },
  ];

  return {
    baseMinimumPerception: Math.round(baseMinimumPerception),
    tauxMinimum: tauxMinimum * 100,
    deficitConsecutif: input.deficitConsecutif,
    minimumPerceptionAnnuel: Math.round(minimumPerceptionAnnuel),
    acompteTrimestriel: Math.round(acompteTrimestriel),
    acomptes,
  };
}
