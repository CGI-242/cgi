import { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useResponsive } from "@/lib/hooks/useResponsive";
import { fonts, fontWeights } from "@/lib/theme/fonts";

export default function LogoutScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
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
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center", paddingHorizontal: isMobile ? 16 : 24 }}>
      <View style={{ width: "100%", maxWidth: isMobile ? undefined : 420, backgroundColor: colors.card, padding: isMobile ? 20 : 32, alignItems: "center" }}>
        <View
          style={{
            width: 64,
            height: 64,
            backgroundColor: colors.success,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Ionicons name="checkmark" size={32} color={colors.sidebarText} />
        </View>

        <Text style={{ fontFamily: fonts.heading, fontWeight: fontWeights.heading, fontSize: 24, color: colors.text, marginBottom: 8 }}>
          {t("auth.logoutSuccess")}
        </Text>
        <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 14, color: colors.textMuted, textAlign: "center", marginBottom: 32 }}>
          {t("auth.logoutMessage")}
        </Text>

        <TouchableOpacity
          style={{ width: "100%", backgroundColor: colors.primary, padding: 16, alignItems: "center" }}
          onPress={handleReconnect}
          activeOpacity={0.8}
        >
          <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, color: colors.sidebarText, fontSize: 16 }}>
            {t("auth.reconnect")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
