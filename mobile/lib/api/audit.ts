import { api } from "./client";

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  actorId: string;
  actorEmail: string;
  changes: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface AuditPaginatedResult {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuditStats {
  totalLogs: number;
  uniqueActors: number;
  mostFrequentAction: string;
  actionCounts: Record<string, number>;
}

export const auditApi = {
  getOrganizationLogs: async (params: { page?: number; limit?: number; action?: string }): Promise<AuditPaginatedResult> => {
    const { data } = await api.get<AuditPaginatedResult>("/audit/organization", { params });
    return data;
  },

  getUserActions: async (userId: string, params: { page?: number; limit?: number }): Promise<AuditPaginatedResult> => {
    const { data } = await api.get<AuditPaginatedResult>(`/audit/user/${userId}`, { params });
    return data;
  },

  search: async (params: { action?: string; from?: string; to?: string; page?: number; limit?: number }): Promise<AuditPaginatedResult> => {
    const { data } = await api.get<AuditPaginatedResult>("/audit/search", { params });
    return data;
  },

  getStats: async (days?: number): Promise<AuditStats> => {
    const params = days ? { days } : {};
    const { data } = await api.get<AuditStats>("/audit/stats", { params });
    return data;
  },
};
