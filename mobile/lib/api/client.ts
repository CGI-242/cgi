import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3003/api";
export { API_URL };
const API_TIMEOUT_MS = 15_000;

// Détection plateforme
const isWeb = typeof window !== "undefined" && typeof sessionStorage !== "undefined";
const isMobile = !isWeb;

// Storage : SecureStore sur mobile uniquement. Sur web, les cookies httpOnly gèrent l'auth.
let _getToken: () => Promise<string | null>;
let _getRefreshToken: () => Promise<string | null>;
let _setToken: (key: string, value: string) => Promise<void>;
let _removeToken: (key: string) => Promise<void>;

if (isWeb) {
  // Web : les tokens sont dans des cookies httpOnly (invisibles au JS)
  // Le storage sert uniquement pour le fallback mobile-first du store
  _getToken = async () => null;
  _getRefreshToken = async () => null;
  _setToken = async () => {};
  _removeToken = async () => {};
} else {
  _getToken = async () => {
    const { getItemAsync } = require("expo-secure-store");
    return getItemAsync("accessToken");
  };
  _getRefreshToken = async () => {
    const { getItemAsync } = require("expo-secure-store");
    return getItemAsync("refreshToken");
  };
  _setToken = async (key, value) => {
    const { setItemAsync } = require("expo-secure-store");
    return setItemAsync(key, value);
  };
  _removeToken = async (key) => {
    const { deleteItemAsync } = require("expo-secure-store");
    return deleteItemAsync(key);
  };
}

export { isWeb, isMobile };
export const storage = { get: _getToken, set: _setToken, remove: _removeToken };

export const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Envoie les cookies automatiquement (web)
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  if (isMobile) {
    // Mobile : Bearer token + X-Platform
    config.headers["X-Platform"] = "mobile";
    try {
      const token = await _getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      if (__DEV__) console.warn("[auth] Erreur lecture token:", err);
    }
  }
  // Web : cookies httpOnly envoyés automatiquement par le navigateur
  // Pas de header Authorization nécessaire
  return config;
});

// --- Refresh token logic ---
let isRefreshing = false;
let failedQueue: { resolve: (token: string | null) => void; reject: (err: unknown) => void }[] = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
}

async function forceLogout() {
  if (isMobile) {
    try { await _removeToken("accessToken"); } catch (e) { if (__DEV__) console.warn("[auth] Erreur suppression accessToken:", e); }
    try { await _removeToken("refreshToken"); } catch (e) { if (__DEV__) console.warn("[auth] Erreur suppression refreshToken:", e); }
  } else {
    // Web : clear les cookies httpOnly via le serveur
    try { await axios.post(`${API_URL}/auth/clear-session`, {}, { withCredentials: true }); } catch (_) {}
  }
  // Import lazy pour eviter les dependances circulaires
  // On marque la session comme expirée au lieu de déconnecter brutalement (fix C10)
  const { useAuthStore } = require("@/lib/store/auth");
  useAuthStore.getState().setSessionExpired(true);
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _skipAuthRetry?: boolean };

    // Ne pas intercepter : pas de réponse (erreur réseau), non-401, retry, refresh, logout, ou skip explicite
    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry ||
      originalRequest._skipAuthRetry ||
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest.url?.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }

    // File d'attente si un refresh est deja en cours
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        if (isMobile && token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      if (isMobile) {
        const refreshToken = await _getRefreshToken();
        if (!refreshToken) {
          await forceLogout();
          return Promise.reject(error);
        }

        const { data } = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
        const newToken: string = data.token;

        await _setToken("accessToken", newToken);
        if (data.refreshToken) {
          await _setToken("refreshToken", data.refreshToken);
        }

        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } else {
        // Web : le refresh token est dans un cookie httpOnly
        // Le serveur le lit automatiquement
        const { data } = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        processQueue(null, data.token);
        return api(originalRequest);
      }
    } catch (refreshError) {
      processQueue(refreshError, null);
      await forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
