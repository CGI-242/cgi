import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { storage } from "../api/client";
import type { User, AuthStep } from "@/types/auth";

interface AuthState {
  user: User | null;
  email: string;
  otpCode: string;
  devCode: string;
  otpSource: "login" | "register";
  step: AuthStep;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  setEmail: (email: string) => void;
  setOtpCode: (code: string) => void;
  setDevCode: (code: string) => void;
  setOtpSource: (source: "login" | "register") => void;
  setStep: (step: AuthStep) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, token?: string, refreshToken?: string) => Promise<void>;
  logout: () => Promise<void>;
  reset: () => void;
  verifyToken: () => Promise<void>;
}

// sessionStorage sur web (coherent avec client.ts), SecureStore sur mobile
const zustandStorage = createJSONStorage(() => ({
  getItem: async (key: string) => {
    if (typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
      return sessionStorage.getItem(key);
    }
    const { getItemAsync } = require("expo-secure-store");
    return getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    if (typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(key, value);
      return;
    }
    const { setItemAsync } = require("expo-secure-store");
    return setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    if (typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem(key);
      return;
    }
    const { deleteItemAsync } = require("expo-secure-store");
    return deleteItemAsync(key);
  },
}));

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      email: "",
      otpCode: "",
      devCode: "",
      otpSource: "login",
      step: "email",
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user }),
      setEmail: (email) => set({ email }),
      setOtpCode: (otpCode) => set({ otpCode }),
      setDevCode: (devCode) => set({ devCode }),
      setOtpSource: (otpSource) => set({ otpSource }),
      setStep: (step) => set({ step }),
      setLoading: (isLoading) => set({ isLoading }),

      login: async (user, token, refreshToken) => {
        if (token) {
          await storage.set("accessToken", token);
        }
        if (refreshToken) {
          await storage.set("refreshToken", refreshToken);
        }
        set({ user, isAuthenticated: true });
      },

      logout: async () => {
        await storage.remove("accessToken");
        await storage.remove("refreshToken");
        set({
          user: null,
          isAuthenticated: false,
          email: "",
          otpCode: "",
          devCode: "",
          step: "email",
        });
      },

      reset: () =>
        set({
          email: "",
          otpCode: "",
          devCode: "",
          step: "email",
          otpSource: "login",
        }),

      // Verifie que le token existe apres hydratation du store
      verifyToken: async () => {
        if (!get().isAuthenticated) return;
        try {
          const token = await storage.get();
          if (!token) {
            if (__DEV__) console.warn("[auth] isAuthenticated=true mais pas de token, deconnexion");
            await get().logout();
          }
        } catch {
          await get().logout();
        }
      },
    }),
    {
      name: "cgi242-auth",
      storage: zustandStorage,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Apres hydratation, verifier que le token existe
        state?.verifyToken();
      },
    },
  ),
);
