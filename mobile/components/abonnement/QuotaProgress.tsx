import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

interface Props {
  questionsUsed: number;
  questionsLimit: number;
  isUnlimited: boolean;
  remaining: number;
  planColor: string;
  colors: any;
}

export default function QuotaProgress({
  questionsUsed,
  questionsLimit,
  isUnlimited,
  remaining,
  planColor,
  colors,
}: Props) {
  const { t } = useTranslation();
  const progressRatio =
    isUnlimited || questionsLimit === 0
      ? 0
      : Math.min(questionsUsed / questionsLimit, 1);

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
        <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>{t("abonnement.questionQuota")}</Text>
      </View>

      {isUnlimited ? (
        <View style={{ alignItems: "center", paddingVertical: 8 }}>
          <Ionicons name="infinite-outline" size={36} color="#8b5cf6" />
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#8b5cf6", marginTop: 4 }}>
            {t("abonnement.unlimited")}
          </Text>
          <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: 2 }}>
            {questionsUsed} {t("abonnement.questionsAskedThisMonth")}
          </Text>
        </View>
      ) : (
        <>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ fontSize: 16, color: colors.text }}>
              {questionsUsed} / {questionsLimit} {t("abonnement.questionsUsedThisMonth")}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "700", color: planColor }}>
              {remaining} {t("abonnement.remaining")}
            </Text>
          </View>

          <View
            style={{
              height: 10,
              backgroundColor: colors.border,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${Math.round(progressRatio * 100)}%`,
                backgroundColor:
                  progressRatio >= 0.9
                    ? "#dc2626"
                    : progressRatio >= 0.7
                      ? "#d97706"
                      : colors.accent,
              }}
            />
          </View>

          {progressRatio >= 0.9 && (
            <Text style={{ fontSize: 14, color: "#dc2626", marginTop: 6, fontWeight: "600" }}>
              {t("abonnement.nearLimitWarning")}
            </Text>
          )}
        </>
      )}
    </View>
  );
}
