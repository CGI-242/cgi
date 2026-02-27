import { api } from "./client";

export interface OrgSubscription {
  id: string;
  plan: string;
  status: string;
  questionsUsed: number;
  questionsPerMonth: number;
  maxMembers: number;
  currentPeriodStart: string;
  currentPeriodEnd: string | null;
  trialEndsAt: string | null;
}

export interface AdminOrganization {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  memberCount: number;
  totalPrice: number;
  unitPrice: number;
  subscription: OrgSubscription | null;
}

export interface ActivateResponse {
  message: string;
  subscription: OrgSubscription;
}

export const adminApi = {
  getOrganizations: async (): Promise<AdminOrganization[]> => {
    const { data } = await api.get<AdminOrganization[]>("/admin/organizations");
    return data;
  },

  activateSubscription: async (orgId: string, plan: "BASIQUE" | "PRO"): Promise<ActivateResponse> => {
    const { data } = await api.post<ActivateResponse>(`/admin/organizations/${orgId}/activate`, { plan });
    return data;
  },

  renewSubscription: async (orgId: string): Promise<ActivateResponse> => {
    const { data } = await api.post<ActivateResponse>(`/admin/organizations/${orgId}/renew`);
    return data;
  },
};
