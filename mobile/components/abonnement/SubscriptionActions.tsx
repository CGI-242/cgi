import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  plan: string;
  status: string;
  actionLoading: boolean;
  onActivate: (planName: string) => void;
  onRenew: () => void;
  onUpgrade: () => void;
  colors: any;
}

export default function SubscriptionActions({
  plan,
  status,
  actionLoading,
  onActivate,
  onRenew,
  onUpgrade,
  colors,
}: Props) {
  return (
    <View style={{ backgroundColor: colors.card, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: colors.border }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Ionicons name="settings-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>Gestion de l'abonnement</Text>
      </View>

      {actionLoading && (
        <ActivityIndicator size="small" color={colors.primary} style={{ marginBottom: 12 }} />
      )}

      {(plan === "FREE" || status === "EXPIRED") && (
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
          <TouchableOpacity
            onPress={() => onActivate("BASIQUE")}
            disabled={actionLoading}
            style={{ flex: 1, backgroundColor: "#3b82f6", paddingVertical: 12, alignItems: "center", opacity: actionLoading ? 0.6 : 1 }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>Activer Basique</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onActivate("PRO")}
            disabled={actionLoading}
            style={{ flex: 1, backgroundColor: "#8b5cf6", paddingVertical: 12, alignItems: "center", opacity: actionLoading ? 0.6 : 1 }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>Activer Pro</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === "ACTIVE" && (
        <TouchableOpacity
          onPress={onRenew}
          disabled={actionLoading}
          style={{ backgroundColor: "#059669", paddingVertical: 12, alignItems: "center", marginBottom: 10, opacity: actionLoading ? 0.6 : 1 }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>Renouveler l'abonnement</Text>
        </TouchableOpacity>
      )}

      {plan === "BASIQUE" && status === "ACTIVE" && (
        <TouchableOpacity
          onPress={onUpgrade}
          disabled={actionLoading}
          style={{ backgroundColor: "#8b5cf6", paddingVertical: 12, alignItems: "center", opacity: actionLoading ? 0.6 : 1 }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>Passer au Pro</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
