import "../global.css";
import { useEffect } from "react";
import { Platform } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import * as ScreenCapture from "expo-screen-capture";
import ErrorBoundary from "@/components/ErrorBoundary";
import { initSentry, Sentry } from "@/lib/sentry";

initSentry();
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();

    if (Platform.OS === "web") {
      document.title = "CGI242";
      // Protection uniquement en production (permet l'inspection en dev)
      if (!__DEV__) {
        const blockContext = (e: MouseEvent) => e.preventDefault();
        document.addEventListener("contextmenu", blockContext);
        const blockKeys = (e: KeyboardEvent) => {
          if (
            (e.ctrlKey || e.metaKey) &&
            ["c", "a", "p", "s", "u"].includes(e.key.toLowerCase())
          ) {
            e.preventDefault();
          }
          if (e.key === "PrintScreen") e.preventDefault();
        };
        document.addEventListener("keydown", blockKeys);
        return () => {
          document.removeEventListener("contextmenu", blockContext);
          document.removeEventListener("keydown", blockKeys);
        };
      }
    } else if (!__DEV__) {
      ScreenCapture.preventScreenCaptureAsync();
      return () => {
        ScreenCapture.allowScreenCaptureAsync();
      };
    }
  }, []);

  return (
    <ErrorBoundary>
      <StatusBar style="light" backgroundColor="#00815d" />
      <Stack screenOptions={{ headerShown: false, title: "CGI242" }}>
        <Stack.Screen name="(auth)" options={{ title: "CGI242" }} />
        <Stack.Screen name="(app)" options={{ title: "CGI242" }} />
      </Stack>
    </ErrorBoundary>
  );
}

export default Sentry.wrap(RootLayout);
