import { z } from 'zod';
import { idParam } from './common.schema';

export const messageStreamBody = z.object({
  content: z.string().min(1, 'Le contenu du message est requis').max(4000, 'Le message ne peut pas dépasser 4000 caractères'),
  conversationId: z.string().optional(),
});

export const conversationIdParam = idParam;
