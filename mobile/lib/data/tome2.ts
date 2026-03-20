import type { ArticleData, SommaireNode } from "./types";
import { parseArticles, buildChapitreTree } from "./helpers";

// Tome 2 - Livre 1 : Enregistrement
import t2l1ch1Data from "@/data/tome2-livre1-chapitre1.json";
import t2l1ch2Data from "@/data/tome2-livre1-chapitre2.json";
import t2l1ch3Data from "@/data/tome2-livre1-chapitre3.json";
import t2l1ch4Data from "@/data/tome2-livre1-chapitre4.json";
import t2l1ch5Data from "@/data/tome2-livre1-chapitre5.json";
import t2l1ch6Data from "@/data/tome2-livre1-chapitre6.json";
import t2l1ch7Data from "@/data/tome2-livre1-chapitre7.json";
import t2l1ch8Data from "@/data/tome2-livre1-chapitre8.json";
import t2l1ch9Data from "@/data/tome2-livre1-chapitre9.json";
import t2l1ch10Data from "@/data/tome2-livre1-chapitre10.json";
import t2l1ch11Data from "@/data/tome2-livre1-chapitre11.json";
import t2l1ch12Data from "@/data/tome2-livre1-chapitre12.json";
import t2l1ch13Data from "@/data/tome2-livre1-chapitre13.json";
import t2l1ch14Data from "@/data/tome2-livre1-chapitre14.json";
import t2l1ch15Data from "@/data/tome2-livre1-chapitre15.json";
import t2l1ch16Data from "@/data/tome2-livre1-chapitre16.json";
// Tome 2 - Livre 2 : Timbre
import t2l2ch1Data from "@/data/tome2-livre2-chapitre1.json";
import t2l2ch2Data from "@/data/tome2-livre2-chapitre2.json";
import t2l2ch3Data from "@/data/tome2-livre2-chapitre3.json";
import t2l2ch4Data from "@/data/tome2-livre2-chapitre4.json";
import t2l2ch5Data from "@/data/tome2-livre2-chapitre5.json";
import t2l2ch6Data from "@/data/tome2-livre2-chapitre6.json";
import t2l2ncData from "@/data/tome2-livre2-non-codifies.json";
// Tome 2 - Livre 3 : Impôt sur le revenu des valeurs mobilières (abrogé)
import t2l3Data from "@/data/tome2-livre3.json";
// Tome 2 - Livre 4 : Taxe foncière
import t2l4ch1Data from "@/data/tome2-livre4-chapitre1.json";
import t2l4ch2Data from "@/data/tome2-livre4-chapitre2.json";
// Tome 2 - Livre 5 : Curatelle
import t2l5ch1Data from "@/data/tome2-livre5-chapitre1.json";
import t2l5ch2Data from "@/data/tome2-livre5-chapitre2.json";
import t2l5ch3Data from "@/data/tome2-livre5-chapitre3.json";
import t2l5ch4Data from "@/data/tome2-livre5-chapitre4.json";
import t2l5ch5Data from "@/data/tome2-livre5-chapitre5.json";
import t2l5ch6Data from "@/data/tome2-livre5-chapitre6.json";
import t2l5ch7Data from "@/data/tome2-livre5-chapitre7.json";
import t2l5ch8Data from "@/data/tome2-livre5-chapitre8.json";
import t2l5ch9Data from "@/data/tome2-livre5-chapitre9.json";
import t2l5ch10Data from "@/data/tome2-livre5-chapitre10.json";
import t2l5ch11Data from "@/data/tome2-livre5-chapitre11.json";
import t2l5ch12Data from "@/data/tome2-livre5-chapitre12.json";
import t2l5ch13Data from "@/data/tome2-livre5-chapitre13.json";
import t2l5ch14Data from "@/data/tome2-livre5-chapitre14.json";
// Tome 2 - Livres 6, 7, 8
import t2l6Data from "@/data/tome2-livre6.json";
import t2l7Data from "@/data/tome2-livre7.json";
import t2l8Data from "@/data/tome2-livre8.json";
// Tome 2 - Textes non codifiés
import t2tncData from "@/data/tome2-textes-non-codifies.json";

// Livre 1
const at2l1ch1 = parseArticles(t2l1ch1Data.articles);
const at2l1ch2 = parseArticles(t2l1ch2Data.articles);
const at2l1ch3 = parseArticles(t2l1ch3Data.articles);
const at2l1ch4 = parseArticles(t2l1ch4Data.articles);
const at2l1ch5 = parseArticles(t2l1ch5Data.articles);
const at2l1ch6 = parseArticles(t2l1ch6Data.articles);
const at2l1ch7 = parseArticles(t2l1ch7Data.articles);
const at2l1ch8 = parseArticles(t2l1ch8Data.articles);
const at2l1ch9 = parseArticles(t2l1ch9Data.articles);
const at2l1ch10 = parseArticles(t2l1ch10Data.articles);
const at2l1ch11 = parseArticles(t2l1ch11Data.articles);
const at2l1ch12 = parseArticles(t2l1ch12Data.articles);
const at2l1ch13 = parseArticles(t2l1ch13Data.articles);
const at2l1ch14 = parseArticles(t2l1ch14Data.articles);
const at2l1ch15 = parseArticles(t2l1ch15Data.articles);
const at2l1ch16 = parseArticles(t2l1ch16Data.articles);
// Livre 2
const at2l2ch1 = parseArticles(t2l2ch1Data.articles);
const at2l2ch2 = parseArticles(t2l2ch2Data.articles);
const at2l2ch3 = parseArticles(t2l2ch3Data.articles);
const at2l2ch4 = parseArticles(t2l2ch4Data.articles);
const at2l2ch5 = parseArticles(t2l2ch5Data.articles);
const at2l2ch6 = parseArticles(t2l2ch6Data.articles);
const at2l2nc = parseArticles(t2l2ncData.articles);
// Livre 3
const at2l3 = parseArticles(t2l3Data.articles);
// Livre 4
const at2l4ch1 = parseArticles(t2l4ch1Data.articles);
const at2l4ch2 = parseArticles(t2l4ch2Data.articles);
// Livre 5
const at2l5ch1 = parseArticles(t2l5ch1Data.articles);
const at2l5ch2 = parseArticles(t2l5ch2Data.articles);
const at2l5ch3 = parseArticles(t2l5ch3Data.articles);
const at2l5ch4 = parseArticles(t2l5ch4Data.articles);
const at2l5ch5 = parseArticles(t2l5ch5Data.articles);
const at2l5ch6 = parseArticles(t2l5ch6Data.articles);
const at2l5ch7 = parseArticles(t2l5ch7Data.articles);
const at2l5ch8 = parseArticles(t2l5ch8Data.articles);
const at2l5ch9 = parseArticles(t2l5ch9Data.articles);
const at2l5ch10 = parseArticles(t2l5ch10Data.articles);
const at2l5ch11 = parseArticles(t2l5ch11Data.articles);
const at2l5ch12 = parseArticles(t2l5ch12Data.articles);
const at2l5ch13 = parseArticles(t2l5ch13Data.articles);
const at2l5ch14 = parseArticles(t2l5ch14Data.articles);
// Livres 6, 7, 8
const at2l6 = parseArticles(t2l6Data.articles);
const at2l7 = parseArticles(t2l7Data.articles);
const at2l8 = parseArticles(t2l8Data.articles);
const at2tnc = parseArticles(t2tncData.articles);

// Livre 1
const t2l1ch1 = buildChapitreTree(at2l1ch1, `Chapitre 1 - ${t2l1ch1Data.meta.chapitre_titre}`, "t2l1ch1");
const t2l1ch2 = buildChapitreTree(at2l1ch2, `Chapitre 2 - ${t2l1ch2Data.meta.chapitre_titre}`, "t2l1ch2");
const t2l1ch3 = buildChapitreTree(at2l1ch3, `Chapitre 3 - ${t2l1ch3Data.meta.chapitre_titre}`, "t2l1ch3");
const t2l1ch4 = buildChapitreTree(at2l1ch4, `Chapitre 4 - ${t2l1ch4Data.meta.chapitre_titre}`, "t2l1ch4");
const t2l1ch5 = buildChapitreTree(at2l1ch5, `Chapitre 5 - ${t2l1ch5Data.meta.chapitre_titre}`, "t2l1ch5");
const t2l1ch6 = buildChapitreTree(at2l1ch6, `Chapitre 6 - ${t2l1ch6Data.meta.chapitre_titre}`, "t2l1ch6");
const t2l1ch7 = buildChapitreTree(at2l1ch7, `Chapitre 7 - ${t2l1ch7Data.meta.chapitre_titre}`, "t2l1ch7");
const t2l1ch8 = buildChapitreTree(at2l1ch8, `Chapitre 8 - ${t2l1ch8Data.meta.chapitre_titre}`, "t2l1ch8");
const t2l1ch9 = buildChapitreTree(at2l1ch9, `Chapitre 9 - ${t2l1ch9Data.meta.chapitre_titre}`, "t2l1ch9");
const t2l1ch10 = buildChapitreTree(at2l1ch10, `Chapitre 10 - ${t2l1ch10Data.meta.chapitre_titre}`, "t2l1ch10");
const t2l1ch11 = buildChapitreTree(at2l1ch11, `Chapitre 11 - ${t2l1ch11Data.meta.chapitre_titre}`, "t2l1ch11");
const t2l1ch12 = buildChapitreTree(at2l1ch12, `Chapitre 12 - ${t2l1ch12Data.meta.chapitre_titre}`, "t2l1ch12");
const t2l1ch13 = buildChapitreTree(at2l1ch13, `Chapitre 13 - ${t2l1ch13Data.meta.chapitre_titre}`, "t2l1ch13");
const t2l1ch14 = buildChapitreTree(at2l1ch14, `Chapitre 14 - ${t2l1ch14Data.meta.chapitre_titre}`, "t2l1ch14");
const t2l1ch15 = buildChapitreTree(at2l1ch15, `Chapitre 15 - ${t2l1ch15Data.meta.chapitre_titre}`, "t2l1ch15");
const t2l1ch16 = buildChapitreTree(at2l1ch16, `Chapitre 16 - ${t2l1ch16Data.meta.chapitre_titre}`, "t2l1ch16");
// Livre 2
const t2l2ch1 = buildChapitreTree(at2l2ch1, `Chapitre 1 - ${t2l2ch1Data.meta.chapitre_titre}`, "t2l2ch1");
const t2l2ch2 = buildChapitreTree(at2l2ch2, `Chapitre 2 - ${t2l2ch2Data.meta.chapitre_titre}`, "t2l2ch2");
const t2l2ch3 = buildChapitreTree(at2l2ch3, `Chapitre 3 - ${t2l2ch3Data.meta.chapitre_titre}`, "t2l2ch3");
const t2l2ch4 = buildChapitreTree(at2l2ch4, `Chapitre 4 - ${t2l2ch4Data.meta.chapitre_titre}`, "t2l2ch4");
const t2l2ch5 = buildChapitreTree(at2l2ch5, `Chapitre 5 - ${t2l2ch5Data.meta.chapitre_titre}`, "t2l2ch5");
const t2l2ch6 = buildChapitreTree(at2l2ch6, `Chapitre 6 - ${t2l2ch6Data.meta.chapitre_titre}`, "t2l2ch6");
const t2l2nc = buildChapitreTree(at2l2nc, "Droits de timbre non codifiés", "t2l2nc");
// Livre 3
const t2l3node = buildChapitreTree(at2l3, "Art. 1 à 22 — Abrogé", "t2l3");
// Livre 4
const t2l4ch1 = buildChapitreTree(at2l4ch1, `Chapitre 1 - ${t2l4ch1Data.meta.chapitre_titre}`, "t2l4ch1");
const t2l4ch2 = buildChapitreTree(at2l4ch2, `Chapitre 2 - ${t2l4ch2Data.meta.chapitre_titre}`, "t2l4ch2");
// Livre 5
const t2l5ch1 = buildChapitreTree(at2l5ch1, `Chapitre 1 - ${t2l5ch1Data.meta.chapitre_titre}`, "t2l5ch1");
const t2l5ch2 = buildChapitreTree(at2l5ch2, `Chapitre 2 - ${t2l5ch2Data.meta.chapitre_titre}`, "t2l5ch2");
const t2l5ch3 = buildChapitreTree(at2l5ch3, `Chapitre 3 - ${t2l5ch3Data.meta.chapitre_titre}`, "t2l5ch3");
const t2l5ch4 = buildChapitreTree(at2l5ch4, `Chapitre 4 - ${t2l5ch4Data.meta.chapitre_titre}`, "t2l5ch4");
const t2l5ch5 = buildChapitreTree(at2l5ch5, `Chapitre 5 - ${t2l5ch5Data.meta.chapitre_titre}`, "t2l5ch5");
const t2l5ch6 = buildChapitreTree(at2l5ch6, `Chapitre 6 - ${t2l5ch6Data.meta.chapitre_titre}`, "t2l5ch6");
const t2l5ch7 = buildChapitreTree(at2l5ch7, `Chapitre 7 - ${t2l5ch7Data.meta.chapitre_titre}`, "t2l5ch7");
const t2l5ch8 = buildChapitreTree(at2l5ch8, `Chapitre 8 - ${t2l5ch8Data.meta.chapitre_titre}`, "t2l5ch8");
const t2l5ch9 = buildChapitreTree(at2l5ch9, `Chapitre 9 - ${t2l5ch9Data.meta.chapitre_titre}`, "t2l5ch9");
const t2l5ch10 = buildChapitreTree(at2l5ch10, `Chapitre 10 - ${t2l5ch10Data.meta.chapitre_titre}`, "t2l5ch10");
const t2l5ch11 = buildChapitreTree(at2l5ch11, `Chapitre 11 - ${t2l5ch11Data.meta.chapitre_titre}`, "t2l5ch11");
const t2l5ch12 = buildChapitreTree(at2l5ch12, `Chapitre 12 - ${t2l5ch12Data.meta.chapitre_titre}`, "t2l5ch12");
const t2l5ch13 = buildChapitreTree(at2l5ch13, `Chapitre 13 - ${t2l5ch13Data.meta.chapitre_titre}`, "t2l5ch13");
const t2l5ch14 = buildChapitreTree(at2l5ch14, `Chapitre 14 - ${t2l5ch14Data.meta.chapitre_titre}`, "t2l5ch14");
// Livres 6, 7, 8
const t2l6Node = buildChapitreTree(at2l6, `Livre 6 - ${t2l6Data.meta.chapitre_titre || "Taxe sur le kilowatt/heure"} (Abrogé)`, "t2l6");
const t2l7Node = buildChapitreTree(at2l7, "Livre 7 - Taxe sur les appareils automatiques", "t2l7");
const t2l8Node = buildChapitreTree(at2l8, `Livre 8 - ${t2l8Data.meta.chapitre_titre || "Droits relatifs aux domaines de l'État"}`, "t2l8");
const t2tncNode = buildChapitreTree(at2tnc, "Textes non codifiés", "t2tnc");

export const tome2Node: SommaireNode = {
  id: "tome2",
  label: "Tome 2 - Enregistrement, timbre et curatelle",
  children: [
    {
      id: "t2-l1",
      label: "Livre 1 - Enregistrement des actes et mutations",
      children: [t2l1ch1, t2l1ch2, t2l1ch3, t2l1ch4, t2l1ch5, t2l1ch6, t2l1ch7, t2l1ch8,
        t2l1ch9, t2l1ch10, t2l1ch11, t2l1ch12, t2l1ch13, t2l1ch14, t2l1ch15, t2l1ch16],
    },
    {
      id: "t2-l2",
      label: "Livre 2 - Contribution du timbre",
      children: [t2l2ch1, t2l2ch2, t2l2ch3, t2l2ch4, t2l2ch5, t2l2ch6, t2l2nc],
    },
    {
      id: "t2-l3",
      label: "Livre 3 - Impôt sur le revenu des valeurs mobilières (Abrogé)",
      children: [t2l3node],
    },
    {
      id: "t2-l4",
      label: "Livre 4 - Taxe immobilière",
      children: [t2l4ch1, t2l4ch2],
    },
    {
      id: "t2-l5",
      label: "Livre 5 - Curatelle",
      children: [t2l5ch1, t2l5ch2, t2l5ch3, t2l5ch4, t2l5ch5, t2l5ch6, t2l5ch7,
        t2l5ch8, t2l5ch9, t2l5ch10, t2l5ch11, t2l5ch12, t2l5ch13, t2l5ch14],
    },
    t2l6Node,
    t2l7Node,
    t2l8Node,
  ],
};

export const tome2Articles: ArticleData[] = [
  ...at2l1ch1, ...at2l1ch2, ...at2l1ch3, ...at2l1ch4, ...at2l1ch5, ...at2l1ch6, ...at2l1ch7, ...at2l1ch8,
  ...at2l1ch9, ...at2l1ch10, ...at2l1ch11, ...at2l1ch12, ...at2l1ch13, ...at2l1ch14, ...at2l1ch15, ...at2l1ch16,
  ...at2l2ch1, ...at2l2ch2, ...at2l2ch3, ...at2l2ch4, ...at2l2ch5, ...at2l2ch6, ...at2l2nc,
  ...at2l3,
  ...at2l4ch1, ...at2l4ch2,
  ...at2l5ch1, ...at2l5ch2, ...at2l5ch3, ...at2l5ch4, ...at2l5ch5, ...at2l5ch6, ...at2l5ch7,
  ...at2l5ch8, ...at2l5ch9, ...at2l5ch10, ...at2l5ch11, ...at2l5ch12, ...at2l5ch13, ...at2l5ch14,
  ...at2l6, ...at2l7, ...at2l8, ...at2tnc,
];
