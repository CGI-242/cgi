import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";

export default function LogoutScreen() {
  const { t } = useTranslation();
  const clearLoggedOut = useAuthStore((s) => s.clearLoggedOut);

  const handleReconnect = () => {
    clearLoggedOut();
    router.replace("/(auth)");
  };

  return (
    <View className="flex-1 bg-background justify-center items-center px-6">
      <View className="w-full max-w-[420px] bg-card p-8 items-center">
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: "#00c17c",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Ionicons name="checkmark" size={32} color="#fff" />
        </View>

        <Text className="text-2xl font-bold text-text mb-2">
          {t("auth.logoutSuccess")}
        </Text>
        <Text className="text-sm text-muted text-center mb-8">
          {t("auth.logoutMessage")}
        </Text>

        <TouchableOpacity
          className="w-full bg-primary p-4 items-center"
          onPress={handleReconnect}
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-base">
            {t("auth.reconnect")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
