import { z } from 'zod';

export const updateProfileBody = z.object({
  firstName: z.string().min(1, 'Le prénom est invalide').optional(),
  lastName: z.string().min(1, 'Le nom est invalide').optional(),
  phone: z.string().nullable().optional(),
  profession: z.string().nullable().optional(),
});
