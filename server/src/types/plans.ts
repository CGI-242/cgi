export type PlanName = 'FREE' | 'BASIQUE' | 'PRO';

export interface PlanQuota {
  questionsPerMonth: number; // par user
  maxMembers: number;
  pricePerYear: number;       // XAF — prix normal /user/an
  pricePerYearLaunch: number; // XAF — prix lancement (10 premiers) /user/an
  trialDays: number;
}

export const PLAN_QUOTAS: Record<PlanName, PlanQuota> = {
  FREE:    { questionsPerMonth: 5,  maxMembers: 1,  pricePerYear: 0,      pricePerYearLaunch: 0,      trialDays: 7 },
  BASIQUE: { questionsPerMonth: 15, maxMembers: 50, pricePerYear: 75000,  pricePerYearLaunch: 65000,  trialDays: 0 },
  PRO:     { questionsPerMonth: 30, maxMembers: 50, pricePerYear: 115000, pricePerYearLaunch: 100000, trialDays: 0 },
};

// Hiérarchie : index plus élevé = plan supérieur
const PLAN_ORDER: PlanName[] = ['FREE', 'BASIQUE', 'PRO'];

export function getPlanQuota(plan: PlanName): PlanQuota {
  return PLAN_QUOTAS[plan];
}

export function isUnlimited(value: number): boolean {
  return value === -1;
}

export function isPlanAtLeast(current: PlanName, minimum: PlanName): boolean {
  return PLAN_ORDER.indexOf(current) >= PLAN_ORDER.indexOf(minimum);
}

export function getPlanOrder(plan: PlanName): number {
  return PLAN_ORDER.indexOf(plan);
}

export function isPaidPlan(plan: PlanName): boolean {
  return plan !== 'FREE';
}

export function getPlanDisplayName(plan: PlanName): string {
  const names: Record<PlanName, string> = {
    FREE: 'Gratuit',
    BASIQUE: 'Basique',
    PRO: 'Pro',
  };
  return names[plan];
}

/** Remises volume : 3-4 users → -10%, 5-9 → -15%, 10+ → -20% */
function getVolumeDiscount(memberCount: number): number {
  if (memberCount >= 10) return 0.20;
  if (memberCount >= 5) return 0.15;
  if (memberCount >= 3) return 0.10;
  return 0;
}

/**
 * Calcule le prix total annuel pour une organisation.
 * Applique la remise volume dès 3 users.
 */
export function calculateTotalPrice(plan: PlanName, memberCount: number, launch = false): number {
  const quota = PLAN_QUOTAS[plan];
  if (memberCount <= 0) return 0;
  const unitPrice = launch ? quota.pricePerYearLaunch : quota.pricePerYear;
  const discount = getVolumeDiscount(memberCount);
  return Math.round(memberCount * unitPrice * (1 - discount));
}

/**
 * Retourne le prix unitaire selon le nombre de membres (avec remise volume).
 */
export function getUnitPrice(plan: PlanName, memberCount: number, launch = false): number {
  const quota = PLAN_QUOTAS[plan];
  const basePrice = launch ? quota.pricePerYearLaunch : quota.pricePerYear;
  const discount = getVolumeDiscount(memberCount);
  return Math.round(basePrice * (1 - discount));
}
