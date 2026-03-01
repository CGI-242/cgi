import type { ArticleData, SommaireNode } from "./types";

export function parseArticles(raw: any[]): ArticleData[] {
  return raw.filter((a) => typeof a.article === "string").map((a) => {
    // Nettoyer les lignes parasites dans le texte
    const rawTexte: string[] = (a.texte || [])
      // Supprimer le préfixe "Art.X.-" redondant en début de ligne
      .map((line: string) => line.replace(/^Art\.\s*\d+[a-z]*\s*[\.\-–]+\s*/i, ""))
      // Supprimer les lignes qui ne sont qu'un titre de section (ex: "4.1. Acompte...")
      .filter((line: string) => !/^\d+\.\d+[\.\s]/.test(line) || line.length > 120);
    const article: ArticleData = {
      article: a.article,
      titre: a.titre || "",
      texte: rawTexte,
      mots_cles: a.mots_cles || [],
      statut: a.statut || "",
      section: typeof a.section === "string" ? a.section : "Général",
      annee_application: a.annee_application,
    };
    article._searchText = normalize(
      [article.article, article.titre, ...article.mots_cles, ...article.texte].join(" ")
    );
    return article;
  });
}

export function splitSection(raw: string): string[] {
  // Partie 1 format: "Section 3 : Bénéfice imposable - Sous-section 4 : Les charges - §1 Frais"
  // Partie 2 format: "Section 2 : Contribution foncière : I. Propriétés bâties"
  // On détecte le format par la présence de " - " après le premier " : "
  const firstColon = raw.indexOf(" : ");
  if (firstColon === -1) return [raw];

  const rest = raw.substring(firstColon + 3);

  // Format partie 1 : séparateur " - "
  if (rest.includes(" - ")) {
    const dashParts = rest.split(" - ");
    return [raw.substring(0, firstColon) + " : " + dashParts[0], ...dashParts.slice(1)];
  }

  // Format partie 2 : séparateur " : " après le premier
  // "I. Propriétés bâties" → "Sous-section I : Propriétés bâties"
  const colonParts = rest.split(" : ");
  if (colonParts.length > 1) {
    const subs = colonParts.slice(1).map((part) => {
      const match = part.match(/^([IVXLC]+)\.\s*(.+)$/);
      if (match) return `Sous-section ${match[1]} : ${match[2]}`;
      return part;
    });
    return [raw.substring(0, firstColon) + " : " + colonParts[0], ...subs];
  }

  return [raw];
}

export function buildChapitreTree(articles: ArticleData[], titre: string, prefix: string): SommaireNode {
  const sections: SommaireNode[] = [];
  const sectionMap = new Map<string, SommaireNode>();
  const sousSectionMap = new Map<string, SommaireNode>();
  // Dernière sous-section par section, pour rattacher les articles orphelins
  const lastSsMap = new Map<string, SommaireNode>();

  for (const art of articles) {
    const parts = splitSection(art.section || "Général");
    const sectionName = parts[0];
    const sousSectionName = parts[1];
    const paragraphName = parts[2];

    // Section
    if (!sectionMap.has(sectionName)) {
      const node: SommaireNode = {
        id: `${prefix}-s${sectionMap.size}`,
        label: sectionName,
      };
      sectionMap.set(sectionName, node);
      sections.push(node);
    }
    const sectionNode = sectionMap.get(sectionName)!;

    if (!sousSectionName) {
      // Rattacher à la dernière sous-section connue de cette section si elle existe
      const lastSs = lastSsMap.get(sectionName);
      if (lastSs) {
        if (!lastSs.articles) lastSs.articles = [];
        lastSs.articles.push(art);
      } else {
        if (!sectionNode.articles) sectionNode.articles = [];
        sectionNode.articles.push(art);
      }
      continue;
    }

    // Sous-section
    if (!sectionNode.children) sectionNode.children = [];
    const ssKey = `${sectionName}||${sousSectionName}`;
    if (!sousSectionMap.has(ssKey)) {
      const ssNode: SommaireNode = {
        id: `${sectionNode.id}-ss${sectionNode.children.length}`,
        label: sousSectionName,
      };
      sousSectionMap.set(ssKey, ssNode);
      sectionNode.children.push(ssNode);
    }
    const ssNode = sousSectionMap.get(ssKey)!;
    lastSsMap.set(sectionName, ssNode);

    if (!paragraphName) {
      if (!ssNode.articles) ssNode.articles = [];
      ssNode.articles.push(art);
      continue;
    }

    // Paragraphe (§)
    if (!ssNode.children) ssNode.children = [];
    let pNode = ssNode.children.find((c) => c.label === paragraphName);
    if (!pNode) {
      pNode = {
        id: `${ssNode.id}-p${ssNode.children.length}`,
        label: paragraphName,
        articles: [],
      };
      ssNode.children.push(pNode);
    }
    if (!pNode.articles) pNode.articles = [];
    pNode.articles.push(art);
  }

  // Si une seule section "Général", mettre les articles directement sur le chapitre
  if (sections.length === 1 && sections[0].label === "Général") {
    return {
      id: prefix,
      label: titre,
      articles: sections[0].articles,
      children: sections[0].children,
    };
  }

  // Si "Général" est la première section suivie d'autres, mettre ses articles au niveau chapitre
  if (sections.length > 1 && sections[0].label === "Général") {
    return {
      id: prefix,
      label: titre,
      articles: sections[0].articles,
      children: sections.slice(1),
    };
  }

  return {
    id: prefix,
    label: titre,
    children: sections,
  };
}

export function normalize(str: string): string {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
