import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3003/api";
const API_TIMEOUT_MS = 15_000;

// Storage : sessionStorage sur web (non persistant = plus sur), SecureStore sur mobile
let _getToken: () => Promise<string | null>;
let _getRefreshToken: () => Promise<string | null>;
let _setToken: (key: string, value: string) => Promise<void>;
let _removeToken: (key: string) => Promise<void>;

if (typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
  _getToken = async () => sessionStorage.getItem("accessToken");
  _getRefreshToken = async () => sessionStorage.getItem("refreshToken");
  _setToken = async (key, value) => sessionStorage.setItem(key, value);
  _removeToken = async (key) => sessionStorage.removeItem(key);
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

export const storage = { get: _getToken, set: _setToken, remove: _removeToken };

export const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await _getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    if (__DEV__) console.warn("[auth] Erreur lecture token:", err);
  }
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
  try { await _removeToken("accessToken"); } catch (e) { if (__DEV__) console.warn("[auth] Erreur suppression accessToken:", e); }
  try { await _removeToken("refreshToken"); } catch (e) { if (__DEV__) console.warn("[auth] Erreur suppression refreshToken:", e); }
  // Import lazy pour eviter les dependances circulaires
  const { useAuthStore } = require("@/lib/store/auth");
  useAuthStore.getState().logout();
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si ce n'est pas un 401, ou si c'est le refresh endpoint, ou si deja en retry
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh-token")
    ) {
      return Promise.reject(error);
    }

    // File d'attente si un refresh est deja en cours
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
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
    } catch (refreshError) {
      processQueue(refreshError, null);
      await forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
