export type PlanName = 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'TEAM' | 'ENTERPRISE';

export interface PlanQuota {
  questionsPerMonth: number;   // par user (-1 = illimité)
  questionsTotal: number;      // pour FREE uniquement (5 total, pas /mois)
  auditsPerMonth: number;      // documents audit/mois (-1 = illimité)
  auditsTotal: number;         // pour FREE uniquement
  maxMembers: number;          // -1 = illimité
  simulators: 'basic' | 'all'; // 5 de base ou 16 complets
  hasOrganization: boolean;
  hasAnalytics: boolean;
  pricePerYear: number;        // en euros
  trialDays: number;
}

export const PLAN_QUOTAS: Record<PlanName, PlanQuota> = {
  FREE: {
    questionsPerMonth: 0,
    questionsTotal: 5,
    auditsPerMonth: 0,
    auditsTotal: 3,
    maxMembers: 1,
    simulators: 'all',
    hasOrganization: false,
    hasAnalytics: false,
    pricePerYear: 0,
    trialDays: 7,
  },
  STARTER: {
    questionsPerMonth: 15,
    questionsTotal: 0,
    auditsPerMonth: 10,
    auditsTotal: 0,
    maxMembers: 1,
    simulators: 'basic',
    hasOrganization: false,
    hasAnalytics: false,
    pricePerYear: 69,
    trialDays: 0,
  },
  PROFESSIONAL: {
    questionsPerMonth: 30,
    questionsTotal: 0,
    auditsPerMonth: 30,
    auditsTotal: 0,
    maxMembers: 1,
    simulators: 'all',
    hasOrganization: false,
    hasAnalytics: false,
    pricePerYear: 149,
    trialDays: 0,
  },
  TEAM: {
    questionsPerMonth: 200,
    questionsTotal: 0,
    auditsPerMonth: 100,
    auditsTotal: 0,
    maxMembers: 5,
    simulators: 'all',
    hasOrganization: true,
    hasAnalytics: true,
    pricePerYear: 299,
    trialDays: 0,
  },
  ENTERPRISE: {
    questionsPerMonth: -1,
    questionsTotal: 0,
    auditsPerMonth: -1,
    auditsTotal: 0,
    maxMembers: -1,
    simulators: 'all',
    hasOrganization: true,
    hasAnalytics: true,
    pricePerYear: 500,
    trialDays: 0,
  },
};

const PLAN_ORDER: PlanName[] = ['FREE', 'STARTER', 'PROFESSIONAL', 'TEAM', 'ENTERPRISE'];

export function getPlanQuota(plan: PlanName): PlanQuota {
  return PLAN_QUOTAS[plan] || PLAN_QUOTAS.FREE;
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
    STARTER: 'Starter',
    PROFESSIONAL: 'Professional',
    TEAM: 'Team',
    ENTERPRISE: 'Enterprise',
  };
  return names[plan];
}

/** Remises volume sièges (TEAM/ENTERPRISE) : 3-4 → -10%, 5-9 → -15%, 10+ → -20% */
function getVolumeDiscount(memberCount: number): number {
  if (memberCount >= 10) return 0.20;
  if (memberCount >= 5) return 0.15;
  if (memberCount >= 3) return 0.10;
  return 0;
}

export function calculateTotalPrice(plan: PlanName, memberCount: number): number {
  const quota = PLAN_QUOTAS[plan];
  if (memberCount <= 0) return 0;
  const discount = getVolumeDiscount(memberCount);
  return Math.round(memberCount * quota.pricePerYear * (1 - discount));
}

export function getUnitPrice(plan: PlanName, memberCount: number): number {
  const quota = PLAN_QUOTAS[plan];
  const discount = getVolumeDiscount(memberCount);
  return Math.round(quota.pricePerYear * (1 - discount));
}

/** Simulateurs de base (STARTER) */
export const BASIC_SIMULATORS = ['its', 'tva', 'is', 'paie', 'patente'];

/** Tous les simulateurs (PROFESSIONAL+) */
export const ALL_SIMULATORS = [
  'its', 'tva', 'is', 'paie', 'patente',
  'solde-liquidation', 'retenue-source', 'is-parapetrolier',
  'iba', 'ircm', 'irf-loyers', 'taxe-immobiliere',
  'enregistrement', 'cession-parts', 'contribution-fonciere', 'igf',
];
