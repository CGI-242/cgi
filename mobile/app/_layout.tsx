import "@/lib/i18n";
import "../global.css";
import { useEffect } from "react";
import { Platform } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import * as ScreenCapture from "expo-screen-capture";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider, useTheme } from "@/lib/theme/ThemeContext";
import ToastProvider from "@/components/ui/ToastProvider";
import { initSentry, Sentry } from "@/lib/sentry";

initSentry();
SplashScreen.preventAutoHideAsync();

function ThemedStatusBar() {
  const { colors } = useTheme();
  return <StatusBar style="light" backgroundColor={colors.primary} />;
}

function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();

    if (Platform.OS === "web") {
      document.title = "CGI242";
      // Forcer le clic droit : React Native Web le bloque via son Responder system
      const forceContextMenu = (e: Event) => {
        e.stopImmediatePropagation();
      };
      document.addEventListener("contextmenu", forceContextMenu, true);
      return () => {
        document.removeEventListener("contextmenu", forceContextMenu, true);
      };
    } else if (!__DEV__) {
      ScreenCapture.preventScreenCaptureAsync();
      return () => {
        ScreenCapture.allowScreenCaptureAsync();
      };
    }
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <ErrorBoundary>
          <ThemedStatusBar />
          <Stack screenOptions={{ headerShown: false, title: "CGI242" }}>
            <Stack.Screen name="(auth)" options={{ title: "CGI242" }} />
            <Stack.Screen name="(app)" options={{ title: "CGI242" }} />
          </Stack>
        </ErrorBoundary>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default Sentry.wrap(RootLayout);
