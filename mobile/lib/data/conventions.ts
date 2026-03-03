import type { ArticleData, SommaireNode } from "./types";
import { parseArticles, buildChapitreTree } from "./helpers";

// Conventions fiscales
import convCemacCh1Data from "@/data/convention-cemac-chapitre1.json";
import convCemacCh2Data from "@/data/convention-cemac-chapitre2.json";
import convCemacCh3Data from "@/data/convention-cemac-chapitre3.json";
import convCemacCh4Data from "@/data/convention-cemac-chapitre4.json";
import convCemacCh5Data from "@/data/convention-cemac-chapitre5.json";
import convCemacCh6Data from "@/data/convention-cemac-chapitre6.json";
import convChineData from "@/data/convention-chine.json";
import convFranceData from "@/data/convention-france.json";
import convItalieCh1Data from "@/data/convention-italie-chapitre1.json";
import convItalieCh2Data from "@/data/convention-italie-chapitre2.json";
import convItalieCh3Data from "@/data/convention-italie-chapitre3.json";
import convItalieCh4Data from "@/data/convention-italie-chapitre4.json";
import convItalieCh5Data from "@/data/convention-italie-chapitre5.json";
import convItalieCh6Data from "@/data/convention-italie-chapitre6.json";
import convItalieProtoData from "@/data/convention-italie-protocole.json";
import convMauriceCh1Data from "@/data/convention-maurice-chapitre1.json";
import convMauriceCh2Data from "@/data/convention-maurice-chapitre2.json";
import convMauriceCh3Data from "@/data/convention-maurice-chapitre3.json";
import convMauriceCh4Data from "@/data/convention-maurice-chapitre4.json";
import convMauriceCh5Data from "@/data/convention-maurice-chapitre5.json";
import convMauriceCh6Data from "@/data/convention-maurice-chapitre6.json";
import convRwandaData from "@/data/convention-rwanda.json";

// CEMAC
const aConvCemacCh1 = parseArticles(convCemacCh1Data.articles);
const aConvCemacCh2 = parseArticles(convCemacCh2Data.articles);
const aConvCemacCh3 = parseArticles(convCemacCh3Data.articles);
const aConvCemacCh4 = parseArticles(convCemacCh4Data.articles);
const aConvCemacCh5 = parseArticles(convCemacCh5Data.articles);
const aConvCemacCh6 = parseArticles(convCemacCh6Data.articles);
// Bilatérales
const aConvChine = parseArticles(convChineData.articles);
const aConvFrance = parseArticles(convFranceData.articles);
// Italie
const aConvItalieCh1 = parseArticles(convItalieCh1Data.articles);
const aConvItalieCh2 = parseArticles(convItalieCh2Data.articles);
const aConvItalieCh3 = parseArticles(convItalieCh3Data.articles);
const aConvItalieCh4 = parseArticles(convItalieCh4Data.articles);
const aConvItalieCh5 = parseArticles(convItalieCh5Data.articles);
const aConvItalieCh6 = parseArticles(convItalieCh6Data.articles);
const aConvItalieProto = parseArticles(convItalieProtoData.articles);
// Maurice
const aConvMauriceCh1 = parseArticles(convMauriceCh1Data.articles);
const aConvMauriceCh2 = parseArticles(convMauriceCh2Data.articles);
const aConvMauriceCh3 = parseArticles(convMauriceCh3Data.articles);
const aConvMauriceCh4 = parseArticles(convMauriceCh4Data.articles);
const aConvMauriceCh5 = parseArticles(convMauriceCh5Data.articles);
const aConvMauriceCh6 = parseArticles(convMauriceCh6Data.articles);
// Rwanda
const aConvRwanda = parseArticles(convRwandaData.articles);

// Convention CEMAC
const convCemacCh1 = buildChapitreTree(aConvCemacCh1, "Chapitre 1 — Champ d'application", "conv-cemac-ch1");
const convCemacCh2 = buildChapitreTree(aConvCemacCh2, "Chapitre 2 — Définitions générales", "conv-cemac-ch2");
const convCemacCh3 = buildChapitreTree(aConvCemacCh3, "Chapitre 3 — Imposition des revenus", "conv-cemac-ch3");
const convCemacCh4 = buildChapitreTree(aConvCemacCh4, "Chapitre 4 — Élimination de la double imposition", "conv-cemac-ch4");
const convCemacCh5 = buildChapitreTree(aConvCemacCh5, "Chapitre 5 — Dispositions spéciales", "conv-cemac-ch5");
const convCemacCh6 = buildChapitreTree(aConvCemacCh6, "Chapitre 6 — Dispositions finales", "conv-cemac-ch6");
const convCemacNode: SommaireNode = {
  id: "conv-cemac", label: "1.1. Convention CEMAC",
  children: [convCemacCh1, convCemacCh2, convCemacCh3, convCemacCh4, convCemacCh5, convCemacCh6],
};

// Conventions bilatérales
const convChineNode: SommaireNode = { id: "conv-chine", label: "1.2. Convention avec la République Populaire de Chine", articles: aConvChine };
const convFranceNode: SommaireNode = { id: "conv-france", label: "1.3. Convention avec la France", articles: aConvFrance };

// Convention Italie
const convItalieCh1 = buildChapitreTree(aConvItalieCh1, "Chapitre 1 — Champ d'application", "conv-italie-ch1");
const convItalieCh2 = buildChapitreTree(aConvItalieCh2, "Chapitre 2 — Définitions", "conv-italie-ch2");
const convItalieCh3 = buildChapitreTree(aConvItalieCh3, "Chapitre 3 — Imposition des revenus", "conv-italie-ch3");
const convItalieCh4 = buildChapitreTree(aConvItalieCh4, "Chapitre 4 — Élimination de la double imposition", "conv-italie-ch4");
const convItalieCh5 = buildChapitreTree(aConvItalieCh5, "Chapitre 5 — Dispositions spéciales", "conv-italie-ch5");
const convItalieCh6 = buildChapitreTree(aConvItalieCh6, "Chapitre 6 — Dispositions finales", "conv-italie-ch6");
const convItalieProtoNode: SommaireNode = { id: "conv-italie-proto", label: "Protocole", articles: aConvItalieProto };
const convItalieNode: SommaireNode = {
  id: "conv-italie", label: "1.4. Convention avec la République d'Italie",
  children: [convItalieCh1, convItalieCh2, convItalieCh3, convItalieCh4, convItalieCh5, convItalieCh6, convItalieProtoNode],
};

// Convention Maurice
const convMauriceCh1 = buildChapitreTree(aConvMauriceCh1, "Chapitre 1 — Champ d'application", "conv-maurice-ch1");
const convMauriceCh2 = buildChapitreTree(aConvMauriceCh2, "Chapitre 2 — Définitions", "conv-maurice-ch2");
const convMauriceCh3 = buildChapitreTree(aConvMauriceCh3, "Chapitre 3 — Imposition des revenus", "conv-maurice-ch3");
const convMauriceCh4 = buildChapitreTree(aConvMauriceCh4, "Chapitre 4 — Élimination de la double imposition", "conv-maurice-ch4");
const convMauriceCh5 = buildChapitreTree(aConvMauriceCh5, "Chapitre 5 — Dispositions spéciales", "conv-maurice-ch5");
const convMauriceCh6 = buildChapitreTree(aConvMauriceCh6, "Chapitre 6 — Dispositions finales", "conv-maurice-ch6");
const convMauriceNode: SommaireNode = {
  id: "conv-maurice", label: "1.5. Convention avec la République de Maurice",
  children: [convMauriceCh1, convMauriceCh2, convMauriceCh3, convMauriceCh4, convMauriceCh5, convMauriceCh6],
};

const convRwandaNode: SommaireNode = { id: "conv-rwanda", label: "1.6. Convention avec le Rwanda", articles: aConvRwanda };

export const conventionsNode: SommaireNode = {
  id: "conventions", label: "1. Conventions fiscales",
  children: [
    convCemacNode,
    convChineNode,
    convFranceNode,
    convItalieNode,
    convMauriceNode,
    convRwandaNode,
  ],
};

export const conventionsArticles: ArticleData[] = [
  ...aConvCemacCh1, ...aConvCemacCh2, ...aConvCemacCh3, ...aConvCemacCh4, ...aConvCemacCh5, ...aConvCemacCh6,
  ...aConvChine, ...aConvFrance,
  ...aConvItalieCh1, ...aConvItalieCh2, ...aConvItalieCh3, ...aConvItalieCh4, ...aConvItalieCh5, ...aConvItalieCh6, ...aConvItalieProto,
  ...aConvMauriceCh1, ...aConvMauriceCh2, ...aConvMauriceCh3, ...aConvMauriceCh4, ...aConvMauriceCh5, ...aConvMauriceCh6,
  ...aConvRwanda,
];
