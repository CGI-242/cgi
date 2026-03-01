import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>Quota de questions</Text>
      </View>

      {isUnlimited ? (
        <View style={{ alignItems: "center", paddingVertical: 8 }}>
          <Ionicons name="infinite-outline" size={36} color="#8b5cf6" />
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#8b5cf6", marginTop: 4 }}>
            Illimite
          </Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>
            {questionsUsed} questions posees ce mois
          </Text>
        </View>
      ) : (
        <>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ fontSize: 14, color: colors.text }}>
              {questionsUsed} / {questionsLimit} questions utilisees ce mois
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "700", color: planColor }}>
              {remaining} restantes
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
            <Text style={{ fontSize: 12, color: "#dc2626", marginTop: 6, fontWeight: "600" }}>
              Attention : vous approchez de la limite mensuelle
            </Text>
          )}
        </>
      )}
    </View>
  );
}
