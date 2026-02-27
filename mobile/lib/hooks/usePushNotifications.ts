import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { useAuthStore } from "../store/auth";
import { notificationsApi } from "../api/notifications";

export function usePushNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const registered = useRef(false);

  useEffect(() => {
    if (Platform.OS === "web" || !isAuthenticated || registered.current) return;

    (async () => {
      try {
        const Notifications = await import("expo-notifications");
        const Device = await import("expo-device");

        if (!Device.isDevice) return;

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") return;

        const tokenData = await Notifications.getExpoPushTokenAsync();
        const pushToken = tokenData.data;

        await notificationsApi.register(pushToken, Platform.OS);
        registered.current = true;

        // Configure notification handler for in-app display
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
        });
      } catch (err) {
        console.warn("Push notification registration failed:", err);
      }
    })();
  }, [isAuthenticated]);
}
