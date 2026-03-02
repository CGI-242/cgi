import { Platform } from "react-native";
import { Redirect } from "expo-router";
import { useAuthStore } from "@/lib/store/auth";
import LandingPage from "@/components/landing/LandingPage";

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
  }

  // Web: afficher la landing page marketing
  if (Platform.OS === "web") {
    return <LandingPage />;
  }

  // Mobile natif: rediriger vers la connexion
  return <Redirect href="/(auth)" />;
}
