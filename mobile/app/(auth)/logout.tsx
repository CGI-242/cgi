import { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";
import { useResponsive } from "@/lib/hooks/useResponsive";
import { fonts, fontWeights } from "@/lib/theme/fonts";

const BG = "#1A3A5C";
const GOLD = "#D4A843";

export default function LogoutScreen() {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();
  const logout = useAuthStore((s) => s.logout);
  const clearLoggedOut = useAuthStore((s) => s.clearLoggedOut);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const didLogout = useRef(false);

  // Effectuer le logout une fois l'écran monté
  useEffect(() => {
    if (isAuthenticated && !didLogout.current) {
      didLogout.current = true;
      logout();
    }
  }, []);

  const handleReconnect = () => {
    clearLoggedOut();
    router.replace("/(auth)");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff", justifyContent: "center", alignItems: "center", paddingHorizontal: isMobile ? 16 : 24 }}>
      <View style={{ width: "100%", maxWidth: isMobile ? undefined : 440, backgroundColor: BG, padding: isMobile ? 20 : 32, borderRadius: 16, alignItems: "center" }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: `${GOLD}15`,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Ionicons name="log-out-outline" size={32} color={GOLD} />
        </View>

        <Text style={{ fontFamily: fonts.heading, fontWeight: fontWeights.heading, fontSize: 26, color: "#e8e6e1", marginBottom: 8 }}>
          {t("auth.logoutSuccess")}
        </Text>
        <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 16, color: "rgba(255,255,255,0.55)", textAlign: "center", marginBottom: 32 }}>
          {t("auth.logoutMessage")}
        </Text>

        <TouchableOpacity
          style={{ width: "100%", backgroundColor: GOLD, padding: 16, alignItems: "center", borderRadius: 10 }}
          onPress={handleReconnect}
          activeOpacity={0.8}
        >
          <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, color: BG, fontSize: 18 }}>
            {t("auth.reconnect")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
