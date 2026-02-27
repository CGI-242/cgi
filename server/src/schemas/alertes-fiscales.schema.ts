import { z } from 'zod';

export const listAlertesQuery = z.object({
  type: z.string().optional(),
  categorie: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(100),
});
