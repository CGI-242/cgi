import "@/lib/i18n";
import "../global.css";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import * as ScreenCapture from "expo-screen-capture";
import * as Font from "expo-font";
import {
  PlayfairDisplay_700Bold,
  PlayfairDisplay_900Black,
} from "@expo-google-fonts/playfair-display";
import {
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  Outfit_900Black,
} from "@expo-google-fonts/outfit";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider, useTheme } from "@/lib/theme/ThemeContext";
import ToastProvider from "@/components/ui/ToastProvider";
import { initSentry, Sentry } from "@/lib/sentry";
import { GOOGLE_FONTS_URL } from "@/lib/theme/fonts";

initSentry();
SplashScreen.preventAutoHideAsync();

function ThemedStatusBar() {
  const { colors } = useTheme();
  return <StatusBar style="light" backgroundColor={colors.primary} />;
}

function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(Platform.OS === "web");

  useEffect(() => {
    if (Platform.OS === "web") {
      // Web : titre, favicon, polices Google Fonts CDN
      document.title = "NORMX Tax";

      const favicon = document.createElement("link");
      favicon.rel = "icon";
      favicon.type = "image/svg+xml";
      favicon.href = "data:image/svg+xml," + encodeURIComponent('<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="16" fill="#08080d"/><path d="M62 30 A22 22 0 1 0 62 70" fill="none" stroke="#C8A03C" stroke-width="8" stroke-linecap="round"/></svg>');
      document.head.appendChild(favicon);

      const fontsLink = document.createElement("link");
      fontsLink.href = GOOGLE_FONTS_URL;
      fontsLink.rel = "stylesheet";
      document.head.appendChild(fontsLink);

      const forceContextMenu = (e: Event) => {
        e.stopImmediatePropagation();
      };
      document.addEventListener("contextmenu", forceContextMenu, true);

      SplashScreen.hideAsync();

      return () => {
        document.removeEventListener("contextmenu", forceContextMenu, true);
      };
    } else {
      // Native : charger les polices via expo-font
      Font.loadAsync({
        PlayfairDisplay_700Bold,
        PlayfairDisplay_900Black,
        Outfit_300Light,
        Outfit_400Regular,
        Outfit_500Medium,
        Outfit_600SemiBold,
        Outfit_700Bold,
        Outfit_800ExtraBold,
        Outfit_900Black,
      }).then(() => {
        setFontsLoaded(true);
        SplashScreen.hideAsync();
      });

      if (!__DEV__) {
        ScreenCapture.preventScreenCaptureAsync();
        return () => {
          ScreenCapture.allowScreenCaptureAsync();
        };
      }
    }
  }, []);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <ToastProvider>
        <ErrorBoundary>
          <ThemedStatusBar />
          <Stack screenOptions={{ headerShown: false, title: "NORMX Tax" }}>
            <Stack.Screen name="(auth)" options={{ title: "NORMX Tax" }} />
            <Stack.Screen name="(app)" options={{ title: "NORMX Tax" }} />
          </Stack>
        </ErrorBoundary>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default Sentry.wrap(RootLayout);
