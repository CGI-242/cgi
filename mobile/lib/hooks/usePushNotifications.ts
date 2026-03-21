import { useEffect, useRef, useCallback } from "react";
import { Platform } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "../store/auth";
import { notificationsApi } from "../api/notifications";
import { createLogger } from "../utils/logger";

const log = createLogger("push");

const PROJECT_ID = "10683ceb-5899-41bd-a451-b48c96f123f1";

export function usePushNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const registered = useRef(false);
  const tokenRef = useRef<string | null>(null);
  const listenersRef = useRef<{ remove: () => void }[]>([]);

  // Naviguer selon le type de notification
  const handleNotificationResponse = useCallback((response: { notification: { request: { content: { data?: Record<string, unknown> } } } }) => {
    const data = response.notification.request.content.data;
    if (!data?.type) return;

    switch (data.type) {
      case "fiscal_deadlines":
        router.push("/simulateurs" as never);
        break;
      case "seat_request":
      case "seat_request_approved":
      case "seat_request_rejected":
        router.push("/organisation" as never);
        break;
      case "subscription_expiring":
        router.push("/abonnement" as never);
        break;
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === "web" || !isAuthenticated || registered.current) return;

    (async () => {
      try {
        const Notifications = await import("expo-notifications");
        const Device = await import("expo-device");

        if (!Device.isDevice) return;

        // Canal Android (obligatoire Android 8+)
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("fiscal", {
            name: "Échéances fiscales",
            importance: Notifications.AndroidImportance.HIGH,
            sound: "default",
            vibrationPattern: [0, 250, 250, 250],
          });
          await Notifications.setNotificationChannelAsync("general", {
            name: "Notifications générales",
            importance: Notifications.AndroidImportance.DEFAULT,
            sound: "default",
          });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          log.warn("Permission push refusée");
          return;
        }

        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: PROJECT_ID,
        });
        const pushToken = tokenData.data;
        tokenRef.current = pushToken;

        await notificationsApi.register(pushToken, Platform.OS);
        registered.current = true;
        log.info("Token push enregistré");

        // Handler pour notifications en foreground
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
        });

        // Listener : notification reçue (foreground)
        const receivedSub = Notifications.addNotificationReceivedListener((notification) => {
          log.info("Notification reçue:", notification.request.content.title);
        });

        // Listener : tap sur notification
        const responseSub = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

        listenersRef.current = [receivedSub, responseSub];
      } catch (err) {
        log.warn("Échec enregistrement push notification", err);
      }
    })();

    return () => {
      for (const sub of listenersRef.current) {
        sub.remove();
      }
      listenersRef.current = [];
    };
  }, [isAuthenticated, handleNotificationResponse]);

  // Unregister au logout
  useEffect(() => {
    if (!isAuthenticated && tokenRef.current) {
      notificationsApi.unregister(tokenRef.current).catch(() => {});
      tokenRef.current = null;
      registered.current = false;
    }
  }, [isAuthenticated]);
}
