import { z } from 'zod';
import { paidPlanEnum, orgIdParam } from './common.schema';

export const activateOrgBody = z.object({
  plan: paidPlanEnum,
  paidSeats: z.number().int().min(1, 'Au moins 1 siège requis'),
});

export { orgIdParam };
