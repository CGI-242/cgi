import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { api } from "../api/client";
import { useAuthStore } from "../store/auth";
import { createLogger } from "../utils/logger";

const log = createLogger("heartbeat");

const HEARTBEAT_INTERVAL_MS = 60_000; // 1 minute

/**
 * Envoie un heartbeat périodique au serveur pour détecter
 * si la session a été révoquée (connexion depuis un autre appareil).
 *
 * Si le serveur répond 401, force la déconnexion immédiatement.
 */
export function useSessionHeartbeat() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const heartbeat = async () => {
      try {
        await api.get("/auth/heartbeat", {
          timeout: 5000,
          _skipAuthRetry: true,
        } as never);
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 401) {
          log.warn("Session révoquée détectée par heartbeat");
          const { useAuthStore } = require("../store/auth");
          useAuthStore.getState().setSessionExpired(true, "revoked");
        }
        // Ignorer les erreurs réseau (offline)
      }
    };

    // Premier heartbeat après 5s (laisser le temps au login)
    const timeout = setTimeout(() => {
      heartbeat();
      intervalRef.current = setInterval(heartbeat, HEARTBEAT_INTERVAL_MS);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated]);
}
