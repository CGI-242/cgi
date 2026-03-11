/**
 * Service Taxe Immobilière sur les Loyers
 * CGI Tome 2, Livre 4, Art. 1-11
 * Taux = 1/12e du loyer annuel (Art. 1)
 */

export type TypeDebiteur = "proprietaire" | "locataireSousLocation";

export interface TaxeImmobiliereInput {
  loyerAnnuel: number;
  typeDebiteur: TypeDebiteur;
  estNouveauContribuable: boolean;
}

export interface TaxeImmobiliereResult {
  loyerAnnuel: number;
  loyerMensuel: number;
  typeDebiteur: TypeDebiteur;
  taux: number;
  taxeAnnuelle: number;
  taxeMensuelle: number;
  partEtat: number;
  partCollectivites: number;
  penaliteRetard: number;
  echeance: string;
  estNouveauContribuable: boolean;
}

/** Art. 1 : taux = 1/12e */
const TAUX_TAXE = 1 / 12;

/** Art. 4 : répartition 50/50 État / collectivités */
const PART_ETAT = 0.5;

/** Art. 9 : majoration de 50% en cas de retard */
const TAUX_PENALITE = 0.5;

export function calculerTaxeImmobiliere(input: TaxeImmobiliereInput): TaxeImmobiliereResult {
  const loyerAnnuel = Math.max(0, input.loyerAnnuel || 0);
  const loyerMensuel = Math.round(loyerAnnuel / 12);

  // Art. 1 : taxe = 1/12e des loyers annuels
  const taxeAnnuelle = Math.round(loyerAnnuel * TAUX_TAXE);
  const taxeMensuelle = Math.round(taxeAnnuelle / 12);

  // Art. 4 : affectation 50% État, 50% collectivités locales
  const partEtat = Math.round(taxeAnnuelle * PART_ETAT);
  const partCollectivites = taxeAnnuelle - partEtat;

  // Art. 9 : pénalité 50% en cas de retard
  const penaliteRetard = Math.round(taxeAnnuelle * TAUX_PENALITE);

  // Art. 5 : échéance
  const echeance = input.estNouveauContribuable
    ? "Dans les 3 mois suivant l'entrée en jouissance (Art. 5)"
    : "20 février de chaque année (Art. 5)";

  return {
    loyerAnnuel,
    loyerMensuel,
    typeDebiteur: input.typeDebiteur,
    taux: Math.round(TAUX_TAXE * 10000) / 100, // 8.33%
    taxeAnnuelle,
    taxeMensuelle,
    partEtat,
    partCollectivites,
    penaliteRetard,
    echeance,
    estNouveauContribuable: input.estNouveauContribuable,
  };
}
