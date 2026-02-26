import { normalize, parseArticles } from "../helpers";

describe("normalize", () => {
  it("met en minuscules", () => {
    expect(normalize("ARTICLE")).toBe("article");
  });

  it("supprime les accents", () => {
    expect(normalize("bénéfice imposé")).toBe("benefice impose");
  });

  it("gere les caracteres speciaux NFD", () => {
    expect(normalize("résumé")).toBe("resume");
    expect(normalize("côté")).toBe("cote");
  });

  it("chaine vide retourne chaine vide", () => {
    expect(normalize("")).toBe("");
  });
});

describe("parseArticles", () => {
  const rawArticles = [
    {
      article: "Art. 1",
      titre: "Titre 1",
      texte: ["Paragraphe 1"],
      mots_cles: ["impot"],
      statut: "actif",
      section: "Section 1",
      annee_application: 2026,
    },
    {
      article: "Art. 2",
      titre: "Titre 2",
      texte: [],
      mots_cles: [],
      statut: "",
      annee_application: 2026,
    },
    {
      // Pas de champ article string -> filtre
      article: 42,
      titre: "Invalide",
    },
    {
      // Pas de champ article -> filtre
      titre: "Sans article",
    },
  ];

  it("filtre les entrees sans article string", () => {
    const result = parseArticles(rawArticles);
    expect(result).toHaveLength(2);
  });

  it("mappe correctement les champs", () => {
    const result = parseArticles(rawArticles);
    expect(result[0].article).toBe("Art. 1");
    expect(result[0].titre).toBe("Titre 1");
    expect(result[0].texte).toEqual(["Paragraphe 1"]);
    expect(result[0].mots_cles).toEqual(["impot"]);
    expect(result[0].section).toBe("Section 1");
  });

  it("section par defaut = General", () => {
    const result = parseArticles(rawArticles);
    expect(result[1].section).toBe("Général");
  });

  it("pre-calcule _searchText", () => {
    const result = parseArticles(rawArticles);
    expect(result[0]._searchText).toBeDefined();
    expect(result[0]._searchText).toContain("art. 1");
    expect(result[0]._searchText).toContain("titre 1");
    expect(result[0]._searchText).toContain("impot");
    expect(result[0]._searchText).toContain("paragraphe 1");
  });

  it("_searchText est normalise (sans accents, minuscules)", () => {
    const articles = parseArticles([
      {
        article: "Art. 10",
        titre: "Bénéfice imposé",
        texte: ["Résumé"],
        mots_cles: ["côté"],
        statut: "",
        section: "S1",
        annee_application: 2026,
      },
    ]);
    expect(articles[0]._searchText).toContain("benefice impose");
    expect(articles[0]._searchText).toContain("resume");
    expect(articles[0]._searchText).toContain("cote");
  });
});
