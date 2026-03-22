import { api } from "./client";

export interface OrgSubscription {
  id: string;
  plan: string;
  status: string;
  questionsUsed: number;
  questionsPerMonth: number;
  maxMembers: number;
  paidSeats: number;
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

export interface AdminSeatRequest {
  id: string;
  organizationId: string;
  additionalSeats: number;
  currentSeats: number;
  totalSeatsAfter: number;
  unitPrice: number;
  totalPrice: number;
  plan: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNote?: string;
  createdAt: string;
  organization: { id: string; name: string; slug: string };
  requestedBy: { id: string; email: string; firstName?: string; lastName?: string };
}

export const adminApi = {
  getOrganizations: async (): Promise<AdminOrganization[]> => {
    const { data } = await api.get<AdminOrganization[]>("/admin/organizations");
    return data;
  },

  activateSubscription: async (orgId: string, plan: "STARTER" | "PROFESSIONAL" | "TEAM" | "ENTERPRISE", paidSeats: number): Promise<ActivateResponse> => {
    const { data } = await api.post<ActivateResponse>(`/admin/organizations/${orgId}/activate`, { plan, paidSeats });
    return data;
  },

  renewSubscription: async (orgId: string): Promise<ActivateResponse> => {
    const { data } = await api.post<ActivateResponse>(`/admin/organizations/${orgId}/renew`);
    return data;
  },

  getSeatRequests: async (): Promise<AdminSeatRequest[]> => {
    const { data } = await api.get<AdminSeatRequest[]>("/admin/seat-requests");
    return data;
  },

  approveSeatRequest: async (requestId: string): Promise<{ message: string }> => {
    const { data } = await api.post<{ message: string }>(`/admin/seat-requests/${requestId}/approve`);
    return data;
  },

  rejectSeatRequest: async (requestId: string, note?: string): Promise<{ message: string }> => {
    const { data } = await api.post<{ message: string }>(`/admin/seat-requests/${requestId}/reject`, { note });
    return data;
  },
};
