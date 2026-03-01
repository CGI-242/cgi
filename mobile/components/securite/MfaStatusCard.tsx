import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { MfaStatus } from "@/lib/api/mfa";

interface MfaStatusCardProps {
  status: MfaStatus | null;
  colors: any;
}

export default function MfaStatusCard({ status, colors }: MfaStatusCardProps) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="shield-checkmark"
            size={24}
            color={status?.enabled ? "#16a34a" : "#dc2626"}
            style={{ marginRight: 12 }}
          />
          <View>
            <Text
              style={{ fontSize: 16, fontWeight: "700", color: colors.text }}
            >
              Authentification 2FA
            </Text>
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>
              {status?.enabled
                ? "Protège votre compte avec un code TOTP"
                : "Non configurée"}
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: status?.enabled ? "#f0fdf4" : "#fef2f2",
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: status?.enabled ? "#16a34a" : "#dc2626",
            }}
          >
            {status?.enabled ? "Activé" : "Désactivé"}
          </Text>
        </View>
      </View>
      {status?.enabled && (
        <View
          style={{ marginTop: 12, flexDirection: "row", alignItems: "center" }}
        >
          <Ionicons
            name="key-outline"
            size={16}
            color={colors.textSecondary}
            style={{ marginRight: 6 }}
          />
          <Text style={{ fontSize: 13, color: colors.textSecondary }}>
            {status.backupCodesRemaining} code
            {status.backupCodesRemaining > 1 ? "s" : ""} de secours restant
            {status.backupCodesRemaining > 1 ? "s" : ""}
          </Text>
        </View>
      )}
    </View>
  );
}
