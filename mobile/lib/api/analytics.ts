import { api } from "./client";

export interface DashboardData {
  totalQuestions: number;
  totalMembers: number;
  activeMembers: number;
  trend: number;
  questionsToday: number;
  questionsThisWeek: number;
  questionsThisMonth: number;
}

export interface TimeSeriesPoint {
  date: string;
  count: number;
}

export interface MemberStat {
  userId: string;
  name: string;
  email: string;
  questionsCount: number;
  lastActive: string | null;
}

export const analyticsApi = {
  getDashboard: async (): Promise<DashboardData> => {
    const { data } = await api.get<DashboardData>("/analytics/dashboard");
    return data;
  },

  getTimeSeries: async (days?: number): Promise<TimeSeriesPoint[]> => {
    const params = days ? { days } : {};
    const { data } = await api.get<TimeSeriesPoint[]>("/analytics/timeseries", { params });
    return data;
  },

  getMemberStats: async (): Promise<MemberStat[]> => {
    const { data } = await api.get<MemberStat[]>("/analytics/members");
    return data;
  },

  exportCsv: async (days?: number): Promise<Blob> => {
    const params = days ? { days } : {};
    const { data } = await api.get("/analytics/export", { params, responseType: "blob" });
    return data;
  },
};
