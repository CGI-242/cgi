import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface LogoutAllButtonProps {
  actionLoading: boolean;
  onLogoutAll: () => void;
  colors: any;
}

export default function LogoutAllButton({
  actionLoading,
  onLogoutAll,
  colors,
}: LogoutAllButtonProps) {
  return (
    <View
      style={{
        marginTop: 24,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 20,
      }}
    >
      <TouchableOpacity
        onPress={onLogoutAll}
        disabled={actionLoading}
        style={{
          backgroundColor: "#fef2f2",
          paddingVertical: 14,
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="log-out-outline"
            size={18}
            color="#dc2626"
            style={{ marginRight: 8 }}
          />
          <Text
            style={{ color: "#dc2626", fontWeight: "600", fontSize: 14 }}
          >
            Déconnecter tous les appareils
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
