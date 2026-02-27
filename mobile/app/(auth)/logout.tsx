import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";
import { useTheme } from "@/lib/theme/ThemeContext";

export default function LogoutScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const clearLoggedOut = useAuthStore((s) => s.clearLoggedOut);

  const handleReconnect = () => {
    clearLoggedOut();
    router.replace("/(auth)");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }}>
      <View style={{ width: "100%", maxWidth: 420, backgroundColor: colors.card, padding: 32, alignItems: "center" }}>
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

        <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text, marginBottom: 8 }}>
          {t("auth.logoutSuccess")}
        </Text>
        <Text style={{ fontSize: 14, color: colors.textMuted, textAlign: "center", marginBottom: 32 }}>
          {t("auth.logoutMessage")}
        </Text>

        <TouchableOpacity
          style={{ width: "100%", backgroundColor: colors.primary, padding: 16, alignItems: "center" }}
          onPress={handleReconnect}
          activeOpacity={0.8}
        >
          <Text style={{ color: colors.sidebarText, fontWeight: "600", fontSize: 16 }}>
            {t("auth.reconnect")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
