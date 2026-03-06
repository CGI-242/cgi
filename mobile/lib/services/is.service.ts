/**
 * Service Minimum de Perception IS
 * Art. 86-C CGI Congo 2026
 *
 * Taux : 1% (Art. 86-C §3)
 * Base : produits exploitation + financiers + HAO - retenues liberatoires (Art. 86-C §2)
 * Le minimum de perception est verse en 4 acomptes trimestriels (Art. 86-C §5)
 * avant meme la liquidation de l'IS sur le resultat fiscal.
 */

export interface IsInput {
  produitsExploitation: number | null;
  produitsFinanciers: number | null;
  produitsHAO: number | null;
  retenuesLiberatoires: number | null;
}

export interface IsResult {
  baseMinimumPerception: number;
  tauxMinimum: number;
  minimumPerceptionAnnuel: number;
  acompteTrimestriel: number;
  acomptes: { label: string; montant: number }[];
}

// Art. 86-C §3 : Le taux du minimum de perception est fixé à 1%
const TAUX_MINIMUM = 0.01;

export function calculerIS(input: IsInput): IsResult {
  const produitsExploitation = input.produitsExploitation || 0;
  const produitsFinanciers = input.produitsFinanciers || 0;
  const produitsHAO = input.produitsHAO || 0;
  const retenuesLiberatoires = input.retenuesLiberatoires || 0;

  const baseMinimumPerception =
    produitsExploitation + produitsFinanciers + produitsHAO - retenuesLiberatoires;

  const minimumPerceptionAnnuel = Math.max(0, baseMinimumPerception * TAUX_MINIMUM);
  const acompteTrimestriel = minimumPerceptionAnnuel / 4;

  const acomptes = [
    { label: "1er trimestre (15 mars)", montant: Math.round(acompteTrimestriel) },
    { label: "2e trimestre (15 juin)", montant: Math.round(acompteTrimestriel) },
    { label: "3e trimestre (15 sept.)", montant: Math.round(acompteTrimestriel) },
    { label: "4e trimestre (15 dec.)", montant: Math.round(acompteTrimestriel) },
  ];

  return {
    baseMinimumPerception: Math.round(baseMinimumPerception),
    tauxMinimum: TAUX_MINIMUM * 100,
    minimumPerceptionAnnuel: Math.round(minimumPerceptionAnnuel),
    acompteTrimestriel: Math.round(acompteTrimestriel),
    acomptes,
  };
}
