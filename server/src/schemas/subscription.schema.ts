import { z } from 'zod';
import { paidPlanEnum } from './common.schema';

export const activateBody = z.object({
  plan: paidPlanEnum,
});

export const upgradeBody = z.object({
  plan: paidPlanEnum,
});
