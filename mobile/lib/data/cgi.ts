import { normalize } from "./helpers";

export type { ArticleData, SommaireNode } from "./types";
import type { ArticleData, SommaireNode } from "./types";

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

export function searchArticles(query: string): ArticleData[] {
  ensureLoaded();
  const q = normalize(query.trim());
  if (!q) return [];

  const words = q.split(/\s+/).filter((w) => w.length > 0);
  if (words.length === 0) return [];

  const scored: { art: ArticleData; score: number }[] = [];

  for (const art of _allArticles!) {
    // Tous les mots doivent être présents dans le texte de recherche
    const st = art._searchText || "";
    if (!words.every((w) => st.includes(w))) continue;

    let score = 0;

    // Numéro d'article exact (ex: "art. 61", "61") → score très élevé
    const artNum = normalize(art.article);
    if (artNum === q || artNum === "art. " + q) {
      score += 100;
    } else if (artNum.includes(q)) {
      score += 50;
    }

    // Titre contient les mots
    const titreN = normalize(art.titre);
    const titreMatches = words.filter((w) => titreN.includes(w)).length;
    score += titreMatches * 10;

    // Mots-clés contiennent les mots
    const mcN = art.mots_cles.map(normalize).join(" ");
    const mcMatches = words.filter((w) => mcN.includes(w)).length;
    score += mcMatches * 5;

    // Bonus si le texte complet contient la requête exacte (pas juste les mots séparés)
    if (words.length > 1 && st.includes(q)) {
      score += 15;
    }

    scored.push({ art, score });
  }

  // Tri par score décroissant
  scored.sort((a, b) => b.score - a.score);

  return scored.map((s) => s.art);
}
