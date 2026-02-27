import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";
import { useTheme } from "@/lib/theme/ThemeContext";

export default function SessionExpiredModal() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const sessionExpired = useAuthStore((s) => s.sessionExpired);
  const logout = useAuthStore((s) => s.logout);

  if (!sessionExpired) return null;

  const handleReconnect = async () => {
    await logout();
  };

  return (
    <Modal visible transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <View
          style={{
            backgroundColor: colors.card,
            
            padding: 32,
            alignItems: "center",
            maxWidth: 400,
            width: "100%",
          }}
        >
          <Ionicons
            name="time-outline"
            size={48}
            color={colors.warning}
            style={{ marginBottom: 16 }}
          />
          <Text
            style={{
              color: colors.text,
              fontSize: 20,
              fontWeight: "700",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            {t("auth.sessionExpired")}
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              textAlign: "center",
              marginBottom: 24,
              lineHeight: 20,
            }}
          >
            {t("auth.sessionExpiredMessage")}
          </Text>
          <TouchableOpacity
            onPress={handleReconnect}
            style={{
              backgroundColor: colors.primary,
              
              paddingVertical: 14,
              paddingHorizontal: 32,
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
              {t("auth.reconnect")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
