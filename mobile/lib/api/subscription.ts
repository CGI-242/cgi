import { api } from "./client";

export interface QuotaResponse {
  plan: string;
  questionsUsed: number;
  questionsPerMonth: number;
  remaining: number;
  isUnlimited: boolean;
  currentPeriodStart: string;
  currentPeriodEnd: string | null;
  status: string;
}

export const subscriptionApi = {
  getQuota: async (): Promise<QuotaResponse> => {
    const { data } = await api.get<QuotaResponse>("/subscription/quota");
    return data;
  },
};
