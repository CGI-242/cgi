import { z } from 'zod';
import { requiredString } from './common.schema';

export const grantPermissionBody = z.object({
  permission: requiredString('permission'),
});

export const revokePermissionBody = z.object({
  permission: requiredString('permission'),
});
