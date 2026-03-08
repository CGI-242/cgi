import type { ArticleData, SommaireNode } from "./types";
import { parseArticles, buildChapitreTree } from "./helpers";

import chapitre1Data from "@/data/tome1-partie1-livre1-chapitre1.json";
import chapitre2Data from "@/data/tome1-partie1-livre1-chapitre2.json";
import chapitre3Data from "@/data/tome1-partie1-livre1-chapitre3.json";
import chapitre4Data from "@/data/tome1-partie1-livre1-chapitre4.json";
import chapitre5Data from "@/data/tome1-partie1-livre1-chapitre5.json";
import chapitre6Data from "@/data/tome1-partie1-livre1-chapitre6.json";
import livre2Data from "@/data/tome1-partie1-livre2.json";
import p2t1ch1Data from "@/data/tome1-partie2-titre1-chapitre1.json";
import p2t1ch2Data from "@/data/tome1-partie2-titre1-chapitre2.json";
import p2t1ch3Data from "@/data/tome1-partie2-titre1-chapitre3.json";
// Partie 3
import p3t1ch1Data from "@/data/tome1-partie3-titre1-chapitre1.json";
import p3t1ch2Data from "@/data/tome1-partie3-titre1-chapitre2.json";
import p3t1ch3Data from "@/data/tome1-partie3-titre1-chapitre3.json";
import p3t1ch4Data from "@/data/tome1-partie3-titre1-chapitre4.json";
import p3t1ch5Data from "@/data/tome1-partie3-titre1-chapitre5.json";
import p3t1ch6Data from "@/data/tome1-partie3-titre1-chapitre6.json";
import p3t1ch7Data from "@/data/tome1-partie3-titre1-chapitre7.json";
import p3t1ch8Data from "@/data/tome1-partie3-titre1-chapitre8.json";
import p3t1ch9Data from "@/data/tome1-partie3-titre1-chapitre9.json";
import p3t2ch1Data from "@/data/tome1-partie3-titre2-chapitre1.json";
import p3t2ch2Data from "@/data/tome1-partie3-titre2-chapitre2.json";
import p3t2ch3Data from "@/data/tome1-partie3-titre2-chapitre3.json";
import p3t3ch1Data from "@/data/tome1-partie3-titre3-chapitre1.json";
import p3t3ch2Data from "@/data/tome1-partie3-titre3-chapitre2.json";
import p3t3ch3Data from "@/data/tome1-partie3-titre3-chapitre3.json";
import p3t3ch4Data from "@/data/tome1-partie3-titre3-chapitre4.json";
import p3t4ch1Data from "@/data/tome1-partie3-titre4-chapitre1.json";
import p3t4ch2Data from "@/data/tome1-partie3-titre4-chapitre2.json";
import p3t4ch3Data from "@/data/tome1-partie3-titre4-chapitre3.json";
// Partie 4
import p4Data from "@/data/tome1-partie4-sanctions-penales.json";
// Annexes
import annexesData from "@/data/tome1-annexes.json";

// Partie 1
const articles1 = parseArticles(chapitre1Data.articles);
const articles2 = parseArticles(chapitre2Data.articles);
const articles3 = parseArticles(chapitre3Data.articles);
const articles4 = parseArticles(chapitre4Data.articles);
const articles5 = parseArticles(chapitre5Data.articles);
const articles6 = parseArticles(chapitre6Data.articles);
const articlesL2 = parseArticles(livre2Data.articles);
// Partie 2
const articlesP2C1 = parseArticles(p2t1ch1Data.articles);
const articlesP2C2 = parseArticles(p2t1ch2Data.articles);
const articlesP2C3 = parseArticles(p2t1ch3Data.articles);
// Partie 3 - Titre 1
const articlesP3T1C1 = parseArticles(p3t1ch1Data.articles);
const articlesP3T1C2 = parseArticles(p3t1ch2Data.articles);
const articlesP3T1C3 = parseArticles(p3t1ch3Data.articles);
const articlesP3T1C4 = parseArticles(p3t1ch4Data.articles);
const articlesP3T1C5 = parseArticles(p3t1ch5Data.articles);
const articlesP3T1C6 = parseArticles(p3t1ch6Data.articles);
const articlesP3T1C7 = parseArticles(p3t1ch7Data.articles);
const articlesP3T1C8 = parseArticles(p3t1ch8Data.articles);
const articlesP3T1C9 = parseArticles(p3t1ch9Data.articles);
// Partie 3 - Titre 2
const articlesP3T2C1 = parseArticles(p3t2ch1Data.articles);
const articlesP3T2C2 = parseArticles(p3t2ch2Data.articles);
const articlesP3T2C3 = parseArticles(p3t2ch3Data.articles);
// Partie 3 - Titre 3
const articlesP3T3C1 = parseArticles(p3t3ch1Data.articles);
const articlesP3T3C2 = parseArticles(p3t3ch2Data.articles);
const articlesP3T3C3 = parseArticles(p3t3ch3Data.articles);
const articlesP3T3C4 = parseArticles(p3t3ch4Data.articles);
// Partie 3 - Titre 4
const articlesP3T4C1 = parseArticles(p3t4ch1Data.articles);
const articlesP3T4C2 = parseArticles(p3t4ch2Data.articles);
const articlesP3T4C3 = parseArticles(p3t4ch3Data.articles);
// Partie 4
const articlesP4 = parseArticles(p4Data.articles);
// Annexes
const articlesAnnexes = parseArticles(annexesData.articles);

// Partie 1
const chapitre1 = buildChapitreTree(articles1, "Chapitre 1 - Impôt sur les sociétés (IS)", "ch1");
const chapitre2 = buildChapitreTree(articles2, "Chapitre 2 - Impôts sur les revenus", "ch2");
// Renommer les sections en sous-chapitres (CGI officiel : Chapitre 2-1, 2-2, 2-3, 2-4)
if (chapitre2.children) {
  chapitre2.children.forEach((child, i) => {
    child.label = child.label.replace(/^Section \d+ : /, `Chapitre 2-${i + 1} - `);
  });
}
const chapitre3 = buildChapitreTree(articles3, "Chapitre 3 - Sans objet", "ch3");
const chapitre4 = buildChapitreTree(articles4, "Chapitre 4 - Dispositions communes", "ch4");
const chapitre5 = buildChapitreTree(articles5, "Chapitre 5 - Taxes diverses", "ch5");
const chapitre6 = buildChapitreTree(articles6, "Chapitre 6 - Dispositions diverses", "ch6");
const livre2: SommaireNode = {
  id: "t1-p1-l2",
  label: "Impôt sur le chiffre d'affaires intérieur",
  articles: articlesL2,
};

// Partie 2 - Titre 1
const p2t1ch1: SommaireNode = { id: "p2t1ch1", label: "Chapitre 1 - Impôts et taxes obligatoires", articles: articlesP2C1 };
const p2t1ch2: SommaireNode = { id: "p2t1ch2", label: "Chapitre 2 - Taxes facultatives", articles: articlesP2C2 };
const p2t1ch3: SommaireNode = { id: "p2t1ch3", label: "Chapitre 3 - Centimes additionnels à certains impôts", articles: articlesP2C3 };

// Partie 3 - Titre 1
const p3t1ch1: SommaireNode = { id: "p3t1ch1", label: "Chapitre 1 - Défaut de déclaration, déclarations tardives ou inexactes", articles: articlesP3T1C1 };
const p3t1ch2: SommaireNode = { id: "p3t1ch2", label: "Chapitre 2 - Prescriptions", articles: articlesP3T1C2 };
const p3t1ch3: SommaireNode = { id: "p3t1ch3", label: "Chapitre 3 - Changement du lieu d'imposition", articles: articlesP3T1C3 };
const p3t1ch4: SommaireNode = { id: "p3t1ch4", label: "Chapitre 4 - Conventions fiscales", articles: articlesP3T1C4 };
const p3t1ch5: SommaireNode = { id: "p3t1ch5", label: "Chapitre 5 - Vérification des contribuables", articles: articlesP3T1C5 };
const p3t1ch6: SommaireNode = { id: "p3t1ch6", label: "Chapitre 6 - Droit de communication", articles: articlesP3T1C6 };
const p3t1ch7: SommaireNode = { id: "p3t1ch7", label: "Chapitre 7 - Commission des impôts", articles: articlesP3T1C7 };
const p3t1ch8: SommaireNode = { id: "p3t1ch8", label: "Chapitre 8 - Secret professionnel", articles: articlesP3T1C8 };
const p3t1ch9: SommaireNode = { id: "p3t1ch9", label: "Chapitre 9 - Marchés publics", articles: articlesP3T1C9 };

// Partie 3 - Titre 2
const p3t2ch1: SommaireNode = { id: "p3t2ch1", label: "Chapitre 1 - Émission des rôles", articles: articlesP3T2C1 };
const p3t2ch2: SommaireNode = { id: "p3t2ch2", label: "Chapitre 2 - Approbation des rôles", articles: articlesP3T2C2 };
const p3t2ch3: SommaireNode = { id: "p3t2ch3", label: "Chapitre 3 - Mise en recouvrement", articles: articlesP3T2C3 };

// Partie 3 - Titre 3
const p3t3ch1: SommaireNode = { id: "p3t3ch1", label: "Chapitre 1 - Domaines respectifs des juridictions contentieuse et gracieuse", articles: articlesP3T3C1 };
const p3t3ch2: SommaireNode = { id: "p3t3ch2", label: "Chapitre 2 - Juridiction contentieuse", articles: articlesP3T3C2 };
const p3t3ch3: SommaireNode = { id: "p3t3ch3", label: "Chapitre 3 - Juridiction gracieuse", articles: articlesP3T3C3 };
const p3t3ch4: SommaireNode = { id: "p3t3ch4", label: "Chapitre 4 - Dispositions communes", articles: articlesP3T3C4 };

// Partie 3 - Titre 4
const p3t4ch1: SommaireNode = { id: "p3t4ch1", label: "Chapitre 1 - Dispositions générales", articles: articlesP3T4C1 };
const p3t4ch2: SommaireNode = { id: "p3t4ch2", label: "Chapitre 2 - Dispositions spéciales", articles: [...articlesP3T4C2, ...articlesP3T4C3] };

// Annexes
const annexesNode: SommaireNode = { id: "t1-annexes", label: "Annexes au Tome 1", articles: articlesAnnexes };

export const tome1Node: SommaireNode = {
  id: "tome1",
  label: "Tome 1 - Code Général des Impôts",
  children: [
    {
      id: "t1-p1",
      label: "Partie 1 - Impôts d'État",
      children: [chapitre1, chapitre2, chapitre3, chapitre4, chapitre5, chapitre6],
    },
    {
      id: "t1-p2",
      label: "Partie 2 - Impositions perçues au profit des collectivités et de divers organismes",
      children: [
        {
          id: "t1-p2-t1",
          label: "Titre 1 - Impôts perçus au profit des collectivités",
          children: [p2t1ch1, p2t1ch2, p2t1ch3],
        },
      ],
    },
    {
      id: "t1-p3",
      label: "Partie 3 - Dispositions communes aux parties 1 et 2",
      children: [
        {
          id: "t1-p3-t1",
          label: "Titre 1 - Dispositions diverses",
          children: [p3t1ch1, p3t1ch2, p3t1ch3, p3t1ch4, p3t1ch5, p3t1ch6, p3t1ch7, p3t1ch8, p3t1ch9],
        },
        {
          id: "t1-p3-t2",
          label: "Titre 2 - Rôles",
          children: [p3t2ch1, p3t2ch2, p3t2ch3],
        },
        {
          id: "t1-p3-t3",
          label: "Titre 3 - Réclamations",
          children: [p3t3ch1, p3t3ch2, p3t3ch3, p3t3ch4],
        },
        {
          id: "t1-p3-t4",
          label: "Titre 4 - Recouvrement",
          children: [p3t4ch1, p3t4ch2],
        },
      ],
    },
    {
      id: "t1-p4",
      label: "Partie 4 - Sanctions pénales",
      articles: articlesP4,
    },
    annexesNode,
  ],
};

export const tome1Articles: ArticleData[] = [
  ...articles1, ...articles2, ...articles3, ...articles4, ...articles5, ...articles6, ...articlesL2,
  ...articlesP2C1, ...articlesP2C2, ...articlesP2C3,
  ...articlesP3T1C1, ...articlesP3T1C2, ...articlesP3T1C3, ...articlesP3T1C4, ...articlesP3T1C5,
  ...articlesP3T1C6, ...articlesP3T1C7, ...articlesP3T1C8, ...articlesP3T1C9,
  ...articlesP3T2C1, ...articlesP3T2C2, ...articlesP3T2C3,
  ...articlesP3T3C1, ...articlesP3T3C2, ...articlesP3T3C3, ...articlesP3T3C4,
  ...articlesP3T4C1, ...articlesP3T4C2, ...articlesP3T4C3,
  ...articlesP4, ...articlesAnnexes,
];
