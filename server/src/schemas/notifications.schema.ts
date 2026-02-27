import { z } from 'zod';
import { requiredString } from './common.schema';

export const registerPushBody = z.object({
  token: requiredString('token'),
  platform: z.string().optional(),
});

export const unregisterPushBody = z.object({
  token: requiredString('token'),
});
