/**
 * Service Retenue à la Source — CGI Congo 2026
 * - 20% non-résidents (Art. 86-D)
 * - 10% prestations non soumises à l'IS (Art. 183)
 * - 10% paiements Trésor Public (TFNC4)
 */

export type TypeRetenue = "non_resident" | "non_soumis_is" | "tresor_public";

export interface RetenueSourceInput {
  montantHT: number;
  typeRetenue: TypeRetenue;
}

export interface RetenueSourceResult {
  montantHT: number;
  taux: number;
  montantRetenue: number;
  montantNet: number;
  articleRef: string;
}

const TAUX_RETENUE: Record<TypeRetenue, number> = {
  non_resident: 0.20,
  non_soumis_is: 0.10,
  tresor_public: 0.10,
};

const ARTICLE_REF: Record<TypeRetenue, string> = {
  non_resident: "Art. 86-D",
  non_soumis_is: "Art. 183",
  tresor_public: "TFNC4",
};

export function calculerRetenueSource(input: RetenueSourceInput): RetenueSourceResult {
  const montantHT = Math.max(0, input.montantHT || 0);
  const taux = TAUX_RETENUE[input.typeRetenue];
  const montantRetenue = Math.round(montantHT * taux);
  const montantNet = montantHT - montantRetenue;

  return {
    montantHT,
    taux: taux * 100,
    montantRetenue,
    montantNet,
    articleRef: ARTICLE_REF[input.typeRetenue],
  };
}
