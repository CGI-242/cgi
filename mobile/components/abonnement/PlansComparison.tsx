import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PLAN_COLORS, PLAN_BG, PLANS_INFO } from "./PlanHeader";

interface Props {
  currentPlan: string;
  colors: any;
}

export default function PlansComparison({ currentPlan, colors }: Props) {
  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Ionicons name="layers-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>Nos offres</Text>
      </View>

      {PLANS_INFO.map((planInfo) => {
        const isCurrentPlan = planInfo.name === currentPlan;
        const color = PLAN_COLORS[planInfo.name];
        const bg = PLAN_BG[planInfo.name];

        return (
          <View
            key={planInfo.name}
            style={{
              backgroundColor: colors.card,
              padding: 16,
              marginBottom: 10,
              borderWidth: isCurrentPlan ? 2 : 1,
              borderColor: isCurrentPlan ? color : colors.border,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    backgroundColor: color,
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                    marginRight: 8,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 12, fontWeight: "800" }}>
                    {planInfo.name}
                  </Text>
                </View>
                {isCurrentPlan && (
                  <View
                    style={{
                      backgroundColor: bg,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                    }}
                  >
                    <Text style={{ color, fontSize: 11, fontWeight: "700" }}>Plan actuel</Text>
                  </View>
                )}
              </View>
              <Text style={{ fontSize: 15, fontWeight: "800", color: colors.text }}>
                {planInfo.price}
              </Text>
            </View>

            {planInfo.priceDetail && (
              <Text style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 8, fontStyle: "italic" }}>
                {planInfo.priceDetail}
              </Text>
            )}

            {planInfo.features.map((feature, idx) => (
              <View
                key={idx}
                style={{ flexDirection: "row", alignItems: "center", marginBottom: idx < planInfo.features.length - 1 ? 6 : 0 }}
              >
                <Ionicons name="checkmark-circle" size={16} color={color} style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 13, color: colors.text }}>{feature}</Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}
