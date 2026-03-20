export type ArticleData = {
  article: string;
  titre: string;
  texte: string[];
  mots_cles: string[];
  statut: string;
  section: string;
  annee_application: number;
  _searchText?: string;
};

export type SommaireNode = {
  id: string;
  label: string;
  children?: SommaireNode[];
  articles?: ArticleData[];
  abroge?: boolean;
};
