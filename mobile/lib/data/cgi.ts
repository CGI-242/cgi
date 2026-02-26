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
  return _allArticles!.filter((art) => art._searchText?.includes(q));
}
