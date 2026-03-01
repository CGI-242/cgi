import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function daysRemaining(dateStr?: string | null): number | null {
  if (!dateStr) return null;
  const end = new Date(dateStr);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

interface Props {
  status: string;
  statusColor: string;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  colors: any;
}

export default function PeriodInfo({
  status,
  statusColor,
  currentPeriodStart,
  currentPeriodEnd,
  colors,
}: Props) {
  const days = daysRemaining(currentPeriodEnd);
  const expirationLabel =
    status === "TRIALING"
      ? "Essai expire le"
      : status === "EXPIRED"
        ? "Expire depuis le"
        : "Renouvellement le";

  return (
    <View
      style={{
        backgroundColor: colors.card,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Ionicons name="calendar-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>Periode</Text>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
        <Text style={{ fontSize: 13, color: colors.textSecondary }}>Debut de periode</Text>
        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>
          {formatDate(currentPeriodStart)}
        </Text>
      </View>

      <View style={{ height: 1, backgroundColor: colors.background, marginVertical: 8 }} />

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
        <Text style={{ fontSize: 13, color: colors.textSecondary }}>{expirationLabel}</Text>
        <Text style={{ fontSize: 14, fontWeight: "600", color: statusColor }}>
          {formatDate(currentPeriodEnd)}
        </Text>
      </View>

      {days !== null && status !== "EXPIRED" && (
        <>
          <View style={{ height: 1, backgroundColor: colors.background, marginVertical: 8 }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>Jours restants</Text>
            <View
              style={{
                backgroundColor: days <= 5 ? "#fee2e2" : days <= 10 ? "#fef3c7" : "#d1fae5",
                paddingHorizontal: 10,
                paddingVertical: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "800",
                  color: days <= 5 ? "#dc2626" : days <= 10 ? "#d97706" : "#059669",
                }}
              >
                {days} jour{days !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>
        </>
      )}

      {status === "EXPIRED" && (
        <View
          style={{
            backgroundColor: "#fee2e2",
            padding: 10,
            marginTop: 8,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="warning-outline" size={18} color="#dc2626" style={{ marginRight: 8 }} />
          <Text style={{ color: "#dc2626", fontSize: 13, fontWeight: "600", flex: 1 }}>
            Votre abonnement a expire. Contactez-nous pour le renouveler.
          </Text>
        </View>
      )}
    </View>
  );
}
