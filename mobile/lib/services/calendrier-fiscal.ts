// Service centralisant les donnees et la logique du calendrier fiscal CGI Congo 2026

export interface EcheanceFiscale {
  jour: number;
  moisIndex: number; // 0-11, -1 = tous les mois (recurrent)
  label: string;
  icon: string;
  recurrent: boolean;
  descriptionKey: string;
}

export interface JourCalendrier {
  jour: number | null;
  estAujourdhui: boolean;
  estPasse: boolean;
  echeances: EcheanceFiscale[];
}

// Les 11 echeances fiscales 2026 du CGI Congo-Brazzaville
export const ECHEANCES_FISCALES: EcheanceFiscale[] = [
  // IS trimestriel (Art. 86C)
  { jour: 15, moisIndex: 2, label: "Minimum perception IS (T1)", icon: "business-outline", recurrent: false, descriptionKey: "calendrier.desc.isT1" },
  { jour: 15, moisIndex: 5, label: "Minimum perception IS (T2)", icon: "business-outline", recurrent: false, descriptionKey: "calendrier.desc.isT2" },
  { jour: 15, moisIndex: 8, label: "Minimum perception IS (T3)", icon: "business-outline", recurrent: false, descriptionKey: "calendrier.desc.isT3" },
  { jour: 15, moisIndex: 11, label: "Minimum perception IS (T4)", icon: "business-outline", recurrent: false, descriptionKey: "calendrier.desc.isT4" },
  // TVA mensuelle (Art. 461 bis)
  { jour: 15, moisIndex: -1, label: "TVA (mensuel)", icon: "receipt-outline", recurrent: true, descriptionKey: "calendrier.desc.tva" },
  // ITS mensuel
  { jour: 15, moisIndex: -1, label: "ITS (mensuel)", icon: "people-outline", recurrent: true, descriptionKey: "calendrier.desc.its" },
  // Patente (Art. 306)
  { jour: 15, moisIndex: 3, label: "Patente annuelle", icon: "storefront-outline", recurrent: false, descriptionKey: "calendrier.desc.patente" },
  // IRF (3 echeances)
  { jour: 15, moisIndex: 4, label: "IRF (1re echeance)", icon: "home-outline", recurrent: false, descriptionKey: "calendrier.desc.irf1" },
  { jour: 20, moisIndex: 7, label: "IRF (2e echeance)", icon: "home-outline", recurrent: false, descriptionKey: "calendrier.desc.irf2" },
  { jour: 15, moisIndex: 10, label: "IRF (3e echeance)", icon: "home-outline", recurrent: false, descriptionKey: "calendrier.desc.irf3" },
];

/**
 * Retourne les echeances d'un mois donne (0-11), y compris les recurrentes.
 */
export function getEcheancesDuMois(mois: number): EcheanceFiscale[] {
  return ECHEANCES_FISCALES.filter(
    (e) => e.moisIndex === mois || (e.recurrent && e.moisIndex === -1)
  );
}

/**
 * Regroupe les echeances d'un mois par jour.
 */
export function getEcheancesParJour(mois: number): Map<number, EcheanceFiscale[]> {
  const map = new Map<number, EcheanceFiscale[]>();
  for (const e of getEcheancesDuMois(mois)) {
    const list = map.get(e.jour) || [];
    list.push(e);
    map.set(e.jour, list);
  }
  return map;
}

/**
 * Genere une grille calendrier (semaines lun->dim) pour un mois/annee donnes.
 */
export function genererGrilleCalendrier(mois: number, annee: number): JourCalendrier[][] {
  const now = new Date();
  const aujourdhui = now.getDate();
  const moisActuel = now.getMonth();
  const anneeActuelle = now.getFullYear();

  const premierJour = new Date(annee, mois, 1);
  const dernierJour = new Date(annee, mois + 1, 0).getDate();

  // Jour de la semaine du 1er (0=dim, 1=lun, ..., 6=sam)
  // On veut lun=0 ... dim=6
  let jourSemaine = premierJour.getDay() - 1;
  if (jourSemaine < 0) jourSemaine = 6; // dimanche -> 6

  const echeancesMap = getEcheancesParJour(mois);
  const semaines: JourCalendrier[][] = [];
  let semaine: JourCalendrier[] = [];

  // Cases vides avant le 1er
  for (let i = 0; i < jourSemaine; i++) {
    semaine.push({ jour: null, estAujourdhui: false, estPasse: false, echeances: [] });
  }

  for (let j = 1; j <= dernierJour; j++) {
    const estAujourdhui = j === aujourdhui && mois === moisActuel && annee === anneeActuelle;
    const estPasse =
      annee < anneeActuelle ||
      (annee === anneeActuelle && mois < moisActuel) ||
      (annee === anneeActuelle && mois === moisActuel && j < aujourdhui);

    semaine.push({
      jour: j,
      estAujourdhui,
      estPasse,
      echeances: echeancesMap.get(j) || [],
    });

    if (semaine.length === 7) {
      semaines.push(semaine);
      semaine = [];
    }
  }

  // Compléter la dernière semaine
  if (semaine.length > 0) {
    while (semaine.length < 7) {
      semaine.push({ jour: null, estAujourdhui: false, estPasse: false, echeances: [] });
    }
    semaines.push(semaine);
  }

  return semaines;
}

/**
 * Calcule le nombre de jours restants avant une echeance.
 */
export function getJoursRestants(jour: number, mois: number): number {
  const now = new Date();
  const target = new Date(now.getFullYear(), mois, jour);
  // Si la date est passée cette année, on prend l'année prochaine
  if (target.getTime() < now.getTime()) {
    target.setFullYear(target.getFullYear() + 1);
  }
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
