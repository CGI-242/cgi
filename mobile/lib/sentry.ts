import * as Sentry from "@sentry/react-native";

const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

export function initSentry() {
  if (__DEV__) return;

  if (!DSN) {
    console.warn("[sentry] EXPO_PUBLIC_SENTRY_DSN non défini — monitoring désactivé en production");
    return;
  }

  Sentry.init({
    dsn: DSN,
    tracesSampleRate: 0.2,
    enableAutoSessionTracking: true,
    environment: "production",
  });
}

export { Sentry };
