import { useState, useEffect } from "react";
import { Platform } from "react-native";
import { API_URL } from "../api/client";

const ONLINE_CHECK_INTERVAL_MS = 15_000;
const HEALTH_URL = API_URL.replace(/\/api$/, "/health");

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const update = () => setIsOnline(navigator.onLine);
      update();
      window.addEventListener("online", update);
      window.addEventListener("offline", update);
      return () => {
        window.removeEventListener("online", update);
        window.removeEventListener("offline", update);
      };
    }

    // Mobile : polling fetch leger toutes les 15s
    let mounted = true;
    const check = async () => {
      try {
        await fetch(HEALTH_URL, {
          method: "HEAD",
          cache: "no-store",
        });
        if (mounted) setIsOnline(true);
      } catch {
        if (mounted) setIsOnline(false);
      }
    };
    check();
    const interval = setInterval(check, ONLINE_CHECK_INTERVAL_MS);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return isOnline;
}
