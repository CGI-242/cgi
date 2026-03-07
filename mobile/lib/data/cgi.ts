import { normalize } from "./helpers";

export type { ArticleData, SommaireNode } from "./types";
import type { ArticleData, SommaireNode } from "./types";

export type SearchResult = {
  art: ArticleData;
  score: number;
  matchedWords: string[]; // mots originaux (non normalisés) trouvés
};

// Chargement differe : les 2.9 MB de JSON ne sont traites
// que quand l'utilisateur ouvre l'ecran Code CGI (pas au demarrage)
let _sommaire: SommaireNode[] | null = null;
let _allArticles: ArticleData[] | null = null;

function ensureLoaded() {
  if (_sommaire) return;

  const { parseArticles } = require("./helpers");
  const { tome1Node, tome1Articles } = require("./tome1");
  const { tome2Node, tome2Articles } = require("./tome2");
  const { conventionsNode, conventionsArticles } = require("./conventions");
  const { tfnc2Node, tfnc3Node, tfnc4Node, tfnc5Node, tfnc6Node, tfncArticles } = require("./tfnc");
  const indexData = require("@/data/index.json");

  const indexArticles = parseArticles(indexData.articles);

  _sommaire = [
    tome1Node,
    tome2Node,
    {
      id: "tfnc",
      label: "Textes fiscaux non codifiés",
      children: [conventionsNode, tfnc2Node, tfnc3Node, tfnc4Node, tfnc5Node, tfnc6Node],
    },
    { id: "index", label: "Index", articles: indexArticles },
  ];

  _allArticles = [
    ...tome1Articles,
    ...tome2Articles,
    ...conventionsArticles,
    ...tfncArticles,
    ...indexArticles,
  ];
}

export function getSommaire(): SommaireNode[] {
  ensureLoaded();
  return _sommaire!;
}

export function getAllArticles(): ArticleData[] {
  ensureLoaded();
  return _allArticles!;
}

// Synonymes fiscaux congolais
const SYNONYMS: Record<string, string[]> = {
  societe: ["entreprise", "personne morale", "entite"],
  entreprise: ["societe", "personne morale", "entite"],
  impot: ["taxe", "contribution", "droit", "imposition"],
  taxe: ["impot", "contribution", "droit"],
  exoneration: ["exemption", "dispense", "franchise"],
  exemption: ["exoneration", "dispense", "franchise"],
  benefice: ["profit", "resultat", "revenu"],
  salaire: ["remuneration", "traitement", "solde"],
  remuneration: ["salaire", "traitement", "solde"],
  contribuable: ["redevable", "assujetti", "imposable"],
  redevable: ["contribuable", "assujetti"],
  amende: ["penalite", "sanction", "majoration"],
  penalite: ["amende", "sanction", "majoration"],
  sanction: ["amende", "penalite", "majoration"],
  recouvrement: ["perception", "collecte"],
  declaration: ["obligation declarative"],
  tva: ["taxe sur la valeur ajoutee"],
  is: ["impot sur les societes"],
  iba: ["impot sur le benefice"],
  patente: ["licence"],
  licence: ["patente"],
  bail: ["loyer", "location"],
  loyer: ["bail", "location"],
  foncier: ["immobilier", "propriete"],
  deduction: ["deductible", "charge deductible"],
  redressement: ["rectification", "rehaussement"],
  controle: ["verification", "inspection"],
  verification: ["controle", "inspection"],
  reclamation: ["contestation", "recours"],
  timbre: ["enregistrement", "droit de timbre"],
};

// Expand les mots de recherche avec les synonymes
function expandWithSynonyms(words: string[]): string[][] {
  return words.map((w) => {
    const syns = SYNONYMS[w];
    return syns ? [w, ...syns.map(normalize)] : [w];
  });
}

// Vérifie si un mot correspond à un mot entier dans le texte
function isWholeWord(text: string, word: string): boolean {
  const re = new RegExp(`(?:^|[\\s,;:.()'/\\-])${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=$|[\\s,;:.()'/\\-])`, "i");
  return re.test(text);
}

// Fuzzy : distance de Levenshtein simplifiée (max 1-2 erreurs)
function fuzzyMatch(word: string, target: string): boolean {
  if (word.length < 4) return false; // pas de fuzzy pour mots courts
  if (target.includes(word)) return true;
  // Vérifier si le mot est contenu avec 1 caractère de différence
  if (word.length >= 5) {
    for (let i = 0; i < word.length; i++) {
      const partial = word.slice(0, i) + word.slice(i + 1);
      if (target.includes(partial)) return true;
    }
  }
  return false;
}

export function searchArticles(query: string): SearchResult[] {
  ensureLoaded();
  const q = normalize(query.trim());
  if (!q) return [];

  const words = q.split(/\s+/).filter((w) => w.length > 0);
  if (words.length === 0) return [];

  const expandedWords = expandWithSynonyms(words);
  const scored: SearchResult[] = [];

  for (const art of _allArticles!) {
    const st = art._searchText || "";

    // Chaque mot (ou un de ses synonymes) doit être présent
    const matchInfo: { original: string; matched: string; isSynonym: boolean }[] = [];
    let allMatched = true;

    for (let i = 0; i < words.length; i++) {
      const variants = expandedWords[i];
      let found = false;
      for (const v of variants) {
        if (st.includes(v)) {
          matchInfo.push({ original: words[i], matched: v, isSynonym: v !== words[i] });
          found = true;
          break;
        }
      }
      if (!found) {
        // Essayer le fuzzy sur le mot original
        if (fuzzyMatch(words[i], st)) {
          matchInfo.push({ original: words[i], matched: words[i], isSynonym: false });
        } else {
          allMatched = false;
          break;
        }
      }
    }

    if (!allMatched) continue;

    let score = 0;
    const matchedWords: string[] = matchInfo.map((m) => m.original);

    // 1. Numéro d'article exact → score très élevé
    const artNum = normalize(art.article);
    if (artNum === q || artNum === "art. " + q) {
      score += 200;
    } else if (artNum.includes(q)) {
      score += 80;
    }

    // 2. Titre
    const titreN = normalize(art.titre);
    for (const m of matchInfo) {
      if (titreN.includes(m.matched)) {
        score += isWholeWord(titreN, m.matched) ? 25 : 12;
        if (m.isSynonym) score -= 3; // léger malus pour synonyme
      }
    }
    // Bonus proportionnel : tous les mots dans le titre
    const titreRatio = matchInfo.filter((m) => titreN.includes(m.matched)).length / matchInfo.length;
    if (titreRatio === 1) score += 20;

    // 3. Mots-clés
    const mcN = art.mots_cles.map(normalize).join(" ");
    for (const m of matchInfo) {
      if (mcN.includes(m.matched)) {
        score += isWholeWord(mcN, m.matched) ? 15 : 7;
      }
    }

    // 4. Bonus mot entier dans le texte complet
    for (const m of matchInfo) {
      if (isWholeWord(st, m.matched)) {
        score += 3;
      }
    }

    // 5. Bonus requête exacte dans le texte
    if (words.length > 1 && st.includes(q)) {
      score += 20;
    }

    // 6. Malus si article "sans objet"
    if (art.statut === "sans objet") {
      score -= 50;
    }

    scored.push({ art, score, matchedWords });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored;
}
