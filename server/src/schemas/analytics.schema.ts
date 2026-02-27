import { z } from 'zod';

export const daysQuery = z.object({
  days: z.coerce.number().int().min(1).default(30),
});
