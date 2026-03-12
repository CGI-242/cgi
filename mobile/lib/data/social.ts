import type { SommaireNode } from "./types";

type SectionEntry = {
  section: number;
  section_nom: string;
};

type ChapitreEntry = {
  chapitre: number | string;
  chapitre_nom: string;
  sections: SectionEntry[];
};

type TitreEntry = {
  titre: number;
  titre_nom: string;
  chapitres: ChapitreEntry[];
};

type SommaireJSON = {
  meta: Record<string, unknown>;
  sommaire: TitreEntry[];
};

let _socialSommaire: SommaireNode[] | null = null;

function buildSocialTree(data: SommaireJSON): SommaireNode[] {
  return data.sommaire.map((titre) => {
    const titreId = `social-t${titre.titre}`;
    const children: SommaireNode[] = titre.chapitres.map((ch) => {
      const chId = `${titreId}-ch${ch.chapitre}`;
      const sectionChildren: SommaireNode[] | undefined =
        ch.sections.length > 0
          ? ch.sections.map((s) => ({
              id: `${chId}-s${s.section}`,
              label: `Section ${s.section} : ${s.section_nom}`,
            }))
          : undefined;
      return {
        id: chId,
        label: `Chapitre ${ch.chapitre} : ${ch.chapitre_nom}`,
        children: sectionChildren,
      };
    });
    return {
      id: titreId,
      label: `Titre ${titre.titre} — ${titre.titre_nom}`,
      children: children.length > 0 ? children : undefined,
    };
  });
}

export function getSocialSommaire(): SommaireNode[] {
  if (_socialSommaire) return _socialSommaire;
  const data = require("@/data/social/sommaire-travail.json");
  _socialSommaire = buildSocialTree(data);
  return _socialSommaire;
}
