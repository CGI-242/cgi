export type PlanName = 'FREE' | 'BASIQUE' | 'PRO';

export interface PlanQuota {
  questionsPerMonth: number; // par user
  maxMembers: number;
  pricePerYear: number;       // XAF — 1 user
  pricePerYearBulk: number;   // XAF — 2+ users (par user)
  trialDays: number;
}

export const PLAN_QUOTAS: Record<PlanName, PlanQuota> = {
  FREE:    { questionsPerMonth: 5,  maxMembers: 1,  pricePerYear: 0,     pricePerYearBulk: 0,     trialDays: 7 },
  BASIQUE: { questionsPerMonth: 20, maxMembers: 50, pricePerYear: 50000, pricePerYearBulk: 45000, trialDays: 0 },
  PRO:     { questionsPerMonth: 50, maxMembers: 50, pricePerYear: 70000, pricePerYearBulk: 65000, trialDays: 0 },
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

/**
 * Calcule le prix total annuel pour une organisation.
 * 1 user → prix plein, 2+ users → prix bulk par user.
 */
export function calculateTotalPrice(plan: PlanName, memberCount: number): number {
  const quota = PLAN_QUOTAS[plan];
  if (memberCount <= 0) return 0;
  if (memberCount === 1) return quota.pricePerYear;
  return memberCount * quota.pricePerYearBulk;
}

/**
 * Retourne le prix unitaire selon le nombre de membres.
 */
export function getUnitPrice(plan: PlanName, memberCount: number): number {
  const quota = PLAN_QUOTAS[plan];
  if (memberCount >= 2) return quota.pricePerYearBulk;
  return quota.pricePerYear;
}
