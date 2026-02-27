import { api } from "./client";

export interface AlerteFiscale {
  id: string;
  title: string;
  description: string;
  type: string;
  categorie: string;
  urgence: "haute" | "moyenne" | "basse";
  articleRef: string | null;
  createdAt: string;
}

export interface AlerteStats {
  total: number;
  parType: Record<string, number>;
  parUrgence: Record<string, number>;
  parCategorie: Record<string, number>;
}

export interface AlertePaginatedResult {
  alertes: AlerteFiscale[];
  total: number;
  page: number;
  limit: number;
}

export const alertesApi = {
  getAlertes: async (params?: { type?: string; categorie?: string; page?: number; limit?: number }): Promise<AlertePaginatedResult> => {
    const { data } = await api.get<AlertePaginatedResult>("/alertes-fiscales", { params });
    return data;
  },

  getStats: async (): Promise<AlerteStats> => {
    const { data } = await api.get<AlerteStats>("/alertes-fiscales/stats");
    return data;
  },

  getByArticle: async (articleNumber: string): Promise<AlerteFiscale[]> => {
    const { data } = await api.get<AlerteFiscale[]>(`/alertes-fiscales/article/${articleNumber}`);
    return data;
  },

  extractAlertes: async (): Promise<{ message: string; count: number }> => {
    const { data } = await api.post<{ message: string; count: number }>("/alertes-fiscales/extract");
    return data;
  },
};
