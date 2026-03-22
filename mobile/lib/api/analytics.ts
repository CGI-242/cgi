import { api } from "./client";

export interface DashboardData {
  totalQuestions: number;
  totalMembers: number;
  activeMembers: number;
  trend: number;
  questionsToday: number;
  questionsThisWeek: number;
  questionsThisMonth: number;
  current: { questions: number; articlesViewed: number; tokensUsed: number };
  previous: { questions: number; articlesViewed: number; tokensUsed: number };
  subscription: { plan: string; questionsUsed: number; questionsPerMonth: number } | null;
}

export interface TimeSeriesPoint {
  date: string;
  count: number;
  articlesViewed: number;
  tokensUsed: number;
}

export interface MemberStat {
  userId: string;
  name: string;
  email: string;
  role: string;
  questionsCount: number;
  messagesLast30d: number;
  searchesLast30d: number;
  lastActive: string | null;
}

export interface PopularSearch {
  query: string;
  count: number;
}

export interface ResponseTimeStats {
  avgResponseTimeMs: number;
  maxResponseTimeMs: number;
  minResponseTimeMs: number;
  avgTokensPerResponse: number;
  totalResponses: number;
}

export interface FeatureUsage {
  chat: number;
  search: number;
  audit: number;
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

  getPopularSearches: async (limit?: number): Promise<PopularSearch[]> => {
    const params = limit ? { limit } : {};
    const { data } = await api.get<PopularSearch[]>("/analytics/popular-searches", { params });
    return data;
  },

  getResponseTimes: async (): Promise<ResponseTimeStats> => {
    const { data } = await api.get<ResponseTimeStats>("/analytics/response-times");
    return data;
  },

  getFeatureUsage: async (): Promise<FeatureUsage> => {
    const { data } = await api.get<FeatureUsage>("/analytics/feature-usage");
    return data;
  },

  exportCsv: async (days?: number): Promise<Blob> => {
    const params = days ? { days } : {};
    const { data } = await api.get("/analytics/export", { params, responseType: "blob" });
    return data;
  },
};
