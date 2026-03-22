import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { fonts, fontWeights } from "@/lib/theme/fonts";

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

const STATUS_LABEL_KEYS: Record<string, string> = {
  ACTIVE: "abonnement.statusActive",
  TRIALING: "abonnement.statusTrialing",
  EXPIRED: "abonnement.statusExpired",
};

const PLANS_INFO = [
  {
    name: "FREE",
    priceKey: "abonnement.planFree",
    priceDetailKey: "abonnement.planFreeDetail",
    featureKeys: ["abonnement.feat5q", "abonnement.featCgiRead", "abonnement.featBasicSim"],
  },
  {
    name: "STARTER",
    priceKey: "abonnement.planStarterPrice",
    priceDetailKey: "abonnement.planStarterDetail",
    featureKeys: ["abonnement.feat15q", "abonnement.featFullCgi", "abonnement.feat5sim", "abonnement.feat10audit"],
  },
  {
    name: "PROFESSIONAL",
    priceKey: "abonnement.planProPrice",
    priceDetailKey: "abonnement.planProDetail",
    featureKeys: ["abonnement.feat30q", "abonnement.featFullCgi", "abonnement.featAllSim", "abonnement.feat30audit", "abonnement.featHistory"],
  },
  {
    name: "TEAM",
    priceKey: "abonnement.planTeamPrice",
    priceDetailKey: "abonnement.planTeamDetail",
    featureKeys: ["abonnement.feat200q", "abonnement.featAllSim", "abonnement.feat100audit", "abonnement.featOrg", "abonnement.featAnalytics", "abonnement.featPriority"],
  },
  {
    name: "ENTERPRISE",
    priceKey: "abonnement.planEnterprisePrice",
    priceDetailKey: "abonnement.planEnterpriseDetail",
    featureKeys: ["abonnement.featUnlimitedQ", "abonnement.featAllSim", "abonnement.featUnlimitedAudit", "abonnement.featUnlimitedMembers", "abonnement.featPriority", "abonnement.featApi"],
  },
];

export { PLAN_COLORS, PLAN_BG, STATUS_COLORS, STATUS_LABEL_KEYS, PLANS_INFO };

interface Props {
  plan: string;
  status: string;
  colors: any;
}

export default function PlanHeader({ plan, status, colors }: Props) {
  const { t } = useTranslation();
  const planColor = PLAN_COLORS[plan] || PLAN_COLORS.FREE;
  const planBg = PLAN_BG[plan] || PLAN_BG.FREE;
  const statusColor = STATUS_COLORS[status] || STATUS_COLORS.EXPIRED;
  const statusLabelKey = STATUS_LABEL_KEYS[status];
  const statusLabel = statusLabelKey ? t(statusLabelKey) : status;

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
          <Text style={{ color: "#fff", fontFamily: fonts.headingBlack, fontWeight: fontWeights.headingBlack, fontSize: 20, letterSpacing: 1 }}>
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
          <Text style={{ color: statusColor, fontSize: 15, fontWeight: "700" }}>
            {statusLabel}
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontFamily: fonts.heading, fontWeight: fontWeights.heading, color: colors.text }}>
          {t(PLANS_INFO.find((p) => p.name === plan)?.priceKey || "abonnement.planFree")}
        </Text>
      </View>
    </View>
  );
}
