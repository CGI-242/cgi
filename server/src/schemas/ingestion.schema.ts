import { z } from 'zod';

const articleItem = z.object({
  numero: z.string().min(1, '"numero" est obligatoire'),
  titre: z.string().min(1, '"titre" est obligatoire'),
  contenu: z.string().min(1, '"contenu" est obligatoire'),
}).passthrough();

export const ingestArticlesBody = z.object({
  articles: z.array(articleItem).min(1, 'Le champ "articles" doit être un tableau non vide'),
});

export const ingestSourcesBody = z.object({
  sources: z.array(z.object({
    articles: z.array(z.unknown()).optional(),
  }).passthrough()).min(1, 'Le champ "sources" doit être un tableau non vide'),
});
