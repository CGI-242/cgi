import { z } from 'zod';
import { paidPlanEnum } from './common.schema';

export const activateBody = z.object({
  plan: paidPlanEnum,
});

export const upgradeBody = z.object({
  plan: paidPlanEnum,
});

export const requestSeatsBody = z.object({
  additionalSeats: z.number().int().min(1, 'Au moins 1 siège requis'),
});

export const rejectSeatsBody = z.object({
  note: z.string().optional(),
});
