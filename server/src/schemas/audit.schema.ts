import { z } from 'zod';
import { paginationQuery, uuidParam } from './common.schema';

export const orgAuditQuery = paginationQuery.extend({
  action: z.string().optional(),
});

export const userAuditQuery = paginationQuery;

export const userAuditParams = z.object({
  userId: uuidParam,
});

export const entityAuditParams = z.object({
  type: z.string().min(1),
  id: uuidParam,
});

export const searchAuditQuery = paginationQuery.extend({
  action: z.string().optional(),
  actorId: z.string().optional(),
  entityType: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export const statsAuditQuery = z.object({
  days: z.coerce.number().int().min(1).default(30),
});

export const cleanupAuditBody = z.object({
  olderThanDays: z.coerce.number().int().min(1).default(365),
});
