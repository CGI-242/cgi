import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { storage, isWeb, isMobile, api } from "../api/client";
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
  loggedOut: boolean;
  sessionExpired: boolean;
  sessionExpiredReason: "expired" | "revoked";
  rememberMe: boolean;

  setUser: (user: User | null) => void;
  setEmail: (email: string) => void;
  setOtpCode: (code: string) => void;
  setDevCode: (code: string) => void;
  setOtpSource: (source: "login" | "register") => void;
  setStep: (step: AuthStep) => void;
  setLoading: (loading: boolean) => void;
  setSessionExpired: (expired: boolean, reason?: "expired" | "revoked") => void;
  clearSessionExpired: () => void;
  setRememberMe: (rememberMe: boolean) => void;
  login: (user: User, token?: string, refreshToken?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearLoggedOut: () => void;
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
      loggedOut: false,
      sessionExpired: false,
      sessionExpiredReason: "expired",
      rememberMe: false,

      setUser: (user) => set({ user }),
      setEmail: (email) => set({ email }),
      setOtpCode: (otpCode) => set({ otpCode }),
      setDevCode: (devCode) => set({ devCode }),
      setOtpSource: (otpSource) => set({ otpSource }),
      setStep: (step) => set({ step }),
      setLoading: (isLoading) => set({ isLoading }),
      setSessionExpired: (sessionExpired, reason) => set({ sessionExpired, sessionExpiredReason: reason || "expired" }),
      clearSessionExpired: () => set({ sessionExpired: false }),
      setRememberMe: (rememberMe) => set({ rememberMe }),

      login: async (user, token, refreshToken) => {
        if (isMobile) {
          // Mobile : stocker les tokens dans SecureStore
          if (token) {
            await storage.set("accessToken", token);
          }
          if (refreshToken) {
            await storage.set("refreshToken", refreshToken);
          }
        }
        // Web : les tokens sont dans des cookies httpOnly (rien à stocker)
        set({ user, isAuthenticated: true });
      },

      logout: async () => {
        // Invalider le token côté serveur avant de nettoyer localement
        try {
          await api.post("/auth/logout");
        } catch {
          // Ignorer les erreurs (token déjà expiré, réseau coupé, etc.)
        }

        if (isMobile) {
          await storage.remove("accessToken");
          await storage.remove("refreshToken");
        }

        set({
          user: null,
          isAuthenticated: false,
          loggedOut: true,
          sessionExpired: false,
          rememberMe: false,
          email: "",
          otpCode: "",
          devCode: "",
          step: "email",
        });
      },

      clearLoggedOut: () => set({ loggedOut: false }),

      reset: () =>
        set({
          email: "",
          otpCode: "",
          devCode: "",
          step: "email",
          otpSource: "login",
        }),

      // Vérifie que la session est valide après hydratation du store
      verifyToken: async () => {
        if (!get().isAuthenticated) return;

        if (isMobile) {
          // Mobile : vérifier que le token existe dans SecureStore
          try {
            const token = await storage.get();
            if (!token) {
              if (__DEV__) console.warn("[auth] isAuthenticated=true mais pas de token, deconnexion");
              set({ user: null, isAuthenticated: false, step: "email" });
            }
          } catch {
            set({ user: null, isAuthenticated: false, step: "email" });
          }
        }
        // Web : vérifier que les cookies httpOnly sont encore valides
        if (isWeb) {
          try {
            await api.get("/user/profile", { _skipAuthRetry: true });
          } catch {
            set({ user: null, isAuthenticated: false, step: "email" });
          }
        }
      },
    }),
    {
      name: "cgi242-auth",
      storage: zustandStorage,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        rememberMe: state.rememberMe,
      }),
      onRehydrateStorage: () => (state) => {
        // Apres hydratation, verifier que le token existe
        state?.verifyToken();
      },
    },
  ),
);
