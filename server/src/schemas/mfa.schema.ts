import { z } from 'zod';
import { requiredString } from './common.schema';

export const enableMfaBody = z.object({
  code: requiredString('code'),
});

export const disableMfaBody = z.object({
  password: requiredString('password'),
});

export const verifyMfaBody = z.object({
  mfaToken: requiredString('mfaToken'),
  code: requiredString('code'),
});
