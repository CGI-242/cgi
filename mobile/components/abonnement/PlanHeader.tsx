import { View, Text } from "react-native";

const PLAN_COLORS: Record<string, string> = {
  FREE: "#6b7280",
  BASIQUE: "#3b82f6",
  PRO: "#8b5cf6",
};

const PLAN_BG: Record<string, string> = {
  FREE: "#f3f4f6",
  BASIQUE: "#eff6ff",
  PRO: "#f5f3ff",
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "#059669",
  TRIALING: "#d97706",
  EXPIRED: "#dc2626",
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Actif",
  TRIALING: "Essai",
  EXPIRED: "Expiré",
};

const PLANS_INFO = [
  {
    name: "FREE",
    price: "Gratuit",
    priceDetail: "7 jours d'essai",
    features: [
      "5 questions IA / mois",
      "Accès au CGI en lecture",
      "Simulateurs de base",
    ],
  },
  {
    name: "BASIQUE",
    price: "75 000 XAF / an",
    priceDetail: "65 000 XAF/an/user (prix lancement)",
    features: [
      "15 questions IA / mois / user",
      "Accès complet au CGI",
      "Tous les simulateurs",
      "Historique des conversations",
      "Jusqu'à 50 membres",
    ],
  },
  {
    name: "PRO",
    price: "115 000 XAF / an",
    priceDetail: "100 000 XAF/an/user (prix lancement)",
    features: [
      "30 questions IA / mois / user",
      "Accès complet au CGI",
      "Tous les simulateurs",
      "Historique illimité",
      "Support prioritaire",
      "Jusqu'à 50 membres",
    ],
  },
];

export { PLAN_COLORS, PLAN_BG, STATUS_COLORS, STATUS_LABELS, PLANS_INFO };

interface Props {
  plan: string;
  status: string;
  colors: any;
}

export default function PlanHeader({ plan, status, colors }: Props) {
  const planColor = PLAN_COLORS[plan] || PLAN_COLORS.FREE;
  const planBg = PLAN_BG[plan] || PLAN_BG.FREE;
  const statusColor = STATUS_COLORS[status] || STATUS_COLORS.EXPIRED;
  const statusLabel = STATUS_LABELS[status] || status;

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderWidth: 2,
        borderColor: planColor,
        overflow: "hidden",
        marginBottom: 16,
      }}
    >
      <View
        style={{
          backgroundColor: planBg,
          paddingVertical: 20,
          paddingHorizontal: 20,
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: planColor,
            paddingHorizontal: 20,
            paddingVertical: 6,
            marginBottom: 8,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "900", letterSpacing: 1 }}>
            {plan}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.card,
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderWidth: 1,
            borderColor: statusColor,
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              backgroundColor: statusColor,
              marginRight: 6,
            }}
          />
          <Text style={{ color: statusColor, fontSize: 13, fontWeight: "700" }}>
            {statusLabel}
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, alignItems: "center" }}>
        <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text }}>
          {PLANS_INFO.find((p) => p.name === plan)?.price || "Gratuit"}
        </Text>
      </View>
    </View>
  );
}
