import { api } from "./client";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  VerifyOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  OtpResponse,
  MessageResponse,
} from "@/types/auth";

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  },

  verifyOtp: async (payload: VerifyOtpPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/verify-otp", payload);
    return data;
  },

  sendOtpEmail: async (email: string): Promise<OtpResponse> => {
    const { data } = await api.post<OtpResponse>("/auth/send-otp-email", { email });
    return data;
  },

  forgotPassword: async (payload: ForgotPasswordPayload): Promise<OtpResponse> => {
    const { data } = await api.post<MessageResponse>("/auth/forgot-password", payload);
    return data;
  },

  resetPassword: async (payload: ResetPasswordPayload): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>("/auth/reset-password", payload);
    return data;
  },
};
