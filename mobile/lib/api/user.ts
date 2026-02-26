import { api } from "./client";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  profession: string | null;
  avatar: string | null;
  createdAt: string;
}

export interface SubscriptionInfo {
  plan: string;
  status: string;
  questionsPerMonth: number;
  questionsUsed: number;
  currentPeriodEnd: string | null;
}

export interface ProfileResponse {
  user: UserProfile;
  subscription: SubscriptionInfo | null;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  profession?: string | null;
}

export const userApi = {
  getProfile: async (): Promise<ProfileResponse> => {
    const { data } = await api.get<ProfileResponse>("/user/profile");
    return data;
  },

  updateProfile: async (payload: UpdateProfileData): Promise<{ user: UserProfile }> => {
    const { data } = await api.put<{ user: UserProfile }>("/user/profile", payload);
    return data;
  },
};
