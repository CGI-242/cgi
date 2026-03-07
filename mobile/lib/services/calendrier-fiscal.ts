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

// Calendrier fiscal complet CGI Congo 2026
export const ECHEANCES_FISCALES: EcheanceFiscale[] = [
  // ===== OBLIGATIONS MENSUELLES (récurrentes) =====
  // TVA mensuelle (Art. 461 bis) — le 15 du mois suivant
  { jour: 15, moisIndex: -1, label: "TVA mensuelle", icon: "receipt-outline", recurrent: true, descriptionKey: "calendrier.desc.tva" },
  // Centimes additionnels TVA (Art. 38-A TFNC6) — avec la TVA
  { jour: 15, moisIndex: -1, label: "Centimes additionnels TVA (5%)", icon: "receipt-outline", recurrent: true, descriptionKey: "calendrier.desc.centimesTva" },
  // ITS mensuel (Art. 116) — le 15 du mois suivant
  { jour: 15, moisIndex: -1, label: "ITS mensuel", icon: "people-outline", recurrent: true, descriptionKey: "calendrier.desc.its" },
  // CNSS mensuel — le 15 du mois suivant
  { jour: 15, moisIndex: -1, label: "CNSS mensuel", icon: "shield-outline", recurrent: true, descriptionKey: "calendrier.desc.cnss" },
  // Retenue à la source (Art. 86-D, Art. 183) — le 15 du mois suivant
  { jour: 15, moisIndex: -1, label: "Retenue à la source", icon: "arrow-down-outline", recurrent: true, descriptionKey: "calendrier.desc.retenue" },
  // IRCM mensuel (Art. 103-110A) — le 15 du mois suivant
  { jour: 15, moisIndex: -1, label: "IRCM mensuel", icon: "trending-up-outline", recurrent: true, descriptionKey: "calendrier.desc.ircm" },

  // ===== JANVIER =====
  // Taxe régionale sur les résidents (Art. 250 bis) — en janvier
  { jour: 31, moisIndex: 0, label: "Taxe régionale (résidents)", icon: "flag-outline", recurrent: false, descriptionKey: "calendrier.desc.taxeRegionale" },

  // ===== MARS =====
  // IS — Minimum perception T1 (Art. 86-C)
  { jour: 15, moisIndex: 2, label: "Minimum perception IS (T1)", icon: "business-outline", recurrent: false, descriptionKey: "calendrier.desc.isT1" },
  // Solde de liquidation IS (Art. 86-A) — 15 mars
  { jour: 15, moisIndex: 2, label: "Solde de liquidation IS", icon: "business-outline", recurrent: false, descriptionKey: "calendrier.desc.soldeIS" },
  // IBA annuel — déclaration (Art. 93-102)
  { jour: 15, moisIndex: 2, label: "Déclaration IBA annuel", icon: "person-outline", recurrent: false, descriptionKey: "calendrier.desc.iba" },
  // IGF — 1er versement trimestriel (Art. 3bis TFNC4)
  { jour: 20, moisIndex: 2, label: "IGF (1er versement)", icon: "wallet-outline", recurrent: false, descriptionKey: "calendrier.desc.igf1" },

  // ===== AVRIL =====
  // Patente annuelle (Art. 314) — du 10 au 20 avril
  { jour: 15, moisIndex: 3, label: "Patente annuelle", icon: "storefront-outline", recurrent: false, descriptionKey: "calendrier.desc.patente" },
  // Centimes additionnels patente (Art. 369 bis) — avec la patente
  { jour: 15, moisIndex: 3, label: "Centimes additionnels patente (5%)", icon: "storefront-outline", recurrent: false, descriptionKey: "calendrier.desc.centimesPatente" },
  // Contribution foncière (Art. 257 bis, 270) — avril
  { jour: 30, moisIndex: 3, label: "Contribution foncière (CFPB/CFPNB)", icon: "home-outline", recurrent: false, descriptionKey: "calendrier.desc.cfpb" },

  // ===== MAI =====
  // IRF Loyers — 1re échéance (Art. 113A)
  { jour: 15, moisIndex: 4, label: "IRF Loyers (1re échéance)", icon: "home-outline", recurrent: false, descriptionKey: "calendrier.desc.irf1" },

  // ===== JUIN =====
  // IS — Minimum perception T2 (Art. 86-C)
  { jour: 15, moisIndex: 5, label: "Minimum perception IS (T2)", icon: "business-outline", recurrent: false, descriptionKey: "calendrier.desc.isT2" },
  // IGF — 2e versement trimestriel (Art. 3bis TFNC4)
  { jour: 20, moisIndex: 5, label: "IGF (2e versement)", icon: "wallet-outline", recurrent: false, descriptionKey: "calendrier.desc.igf2" },

  // ===== AOÛT =====
  // IRF Loyers — 2e échéance (Art. 113A)
  { jour: 20, moisIndex: 7, label: "IRF Loyers (2e échéance)", icon: "home-outline", recurrent: false, descriptionKey: "calendrier.desc.irf2" },

  // ===== SEPTEMBRE =====
  // IS — Minimum perception T3 (Art. 86-C)
  { jour: 15, moisIndex: 8, label: "Minimum perception IS (T3)", icon: "business-outline", recurrent: false, descriptionKey: "calendrier.desc.isT3" },
  // IGF — 3e versement trimestriel (Art. 3bis TFNC4)
  { jour: 20, moisIndex: 8, label: "IGF (3e versement)", icon: "wallet-outline", recurrent: false, descriptionKey: "calendrier.desc.igf3" },

  // ===== NOVEMBRE =====
  // IRF Loyers — 3e échéance (Art. 113A)
  { jour: 15, moisIndex: 10, label: "IRF Loyers (3e échéance)", icon: "home-outline", recurrent: false, descriptionKey: "calendrier.desc.irf3" },

  // ===== DÉCEMBRE =====
  // IS — Minimum perception T4 (Art. 86-C)
  { jour: 15, moisIndex: 11, label: "Minimum perception IS (T4)", icon: "business-outline", recurrent: false, descriptionKey: "calendrier.desc.isT4" },
  // IGF — 4e versement trimestriel (Art. 3bis TFNC4)
  { jour: 20, moisIndex: 11, label: "IGF (4e versement)", icon: "wallet-outline", recurrent: false, descriptionKey: "calendrier.desc.igf4" },
];

/**
 * Retourne les echeances d'un mois donne (0-11), y compris les recurrentes.
 */
export function getEcheancesDuMois(mois: number): EcheanceFiscale[] {
  return ECHEANCES_FISCALES.filter(
    (e) => e.moisIndex === mois || (e.recurrent && e.moisIndex === -1)
  ).sort((a, b) => a.jour - b.jour);
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

/**
 * Nom du mois en français.
 */
const NOMS_MOIS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export function getNomMois(mois: number): string {
  return NOMS_MOIS[mois] || "";
}
