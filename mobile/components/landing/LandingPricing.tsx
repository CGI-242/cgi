import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { fonts, fontWeights } from "@/lib/theme/fonts";

const GOLD = "#c8a03c";

interface Props {
  isMobile: boolean;
}

const PLANS = [
  {
    name: "Gratuit",
    tag: "FREE",
    price: "0",
    period: "7 jours d'essai",
    color: "#6b7280",
    features: [
      "5 questions IA / mois",
      "Accès au CGI en lecture",
      "Simulateurs de base",
    ],
  },
  {
    name: "Basique",
    tag: "BASIQUE",
    price: "75 000",
    period: "XAF / an / organisation",
    priceDetail: "65 000 XAF/an/user — prix lancement",
    color: "#3b82f6",
    popular: false,
    features: [
      "15 questions IA / mois / user",
      "Accès complet au CGI",
      "14 simulateurs fiscaux",
      "Historique des conversations",
      "Jusqu'à 50 membres",
    ],
  },
  {
    name: "Pro",
    tag: "PRO",
    price: "115 000",
    period: "XAF / an / organisation",
    priceDetail: "100 000 XAF/an/user — prix lancement",
    color: "#8b5cf6",
    popular: true,
    features: [
      "30 questions IA / mois / user",
      "Accès complet au CGI",
      "14 simulateurs fiscaux",
      "Historique illimité",
      "Support prioritaire",
      "Jusqu'à 50 membres",
    ],
  },
];

export default function LandingPricing({ isMobile }: Props) {
  return (
    <View style={{ paddingVertical: 60, paddingHorizontal: 24 }}>
      <Text
        style={{
          fontFamily: fonts.headingBlack,
          fontWeight: fontWeights.headingBlack,
          fontSize: isMobile ? 26 : 40,
          color: "#e8e6e1",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Tarifs simples, transparents
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: "#5a5a65",
          fontSize: 15,
          fontFamily: fonts.light,
          fontWeight: fontWeights.light,
          marginBottom: 40,
        }}
      >
        Commencez gratuitement, évoluez selon vos besoins
      </Text>

      <View
        style={{
          flexDirection: isMobile ? "column" : "row",
          gap: 16,
          maxWidth: 1060,
          alignSelf: "center",
          width: "100%",
          justifyContent: "center",
        }}
      >
        {PLANS.map((plan) => (
          <View
            key={plan.tag}
            style={{
              flex: isMobile ? undefined : 1,
              maxWidth: isMobile ? undefined : 340,
              borderRadius: 16,
              borderWidth: plan.popular ? 2 : 1,
              borderColor: plan.popular
                ? plan.color
                : "rgba(255,255,255,0.06)",
              backgroundColor: plan.popular
                ? "rgba(139,92,246,0.04)"
                : "rgba(255,255,255,0.015)",
              padding: 28,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {plan.popular && (
              <View
                style={{
                  position: "absolute",
                  top: 14,
                  right: -28,
                  backgroundColor: plan.color,
                  paddingVertical: 4,
                  paddingHorizontal: 32,
                  transform: [{ rotate: "45deg" }],
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    fontWeight: fontWeights.bold,
                    fontSize: 9,
                    color: "#fff",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Populaire
                </Text>
              </View>
            )}

            {/* Plan name */}
            <Text
              style={{
                fontFamily: fonts.semiBold,
                fontWeight: fontWeights.semiBold,
                fontSize: 13,
                color: plan.color,
                textTransform: "uppercase",
                letterSpacing: 1.2,
                marginBottom: 12,
              }}
            >
              {plan.name}
            </Text>

            {/* Price */}
            <View style={{ flexDirection: "row", alignItems: "baseline", marginBottom: 4 }}>
              <Text
                style={{
                  fontFamily: fonts.headingBlack,
                  fontWeight: fontWeights.headingBlack,
                  fontSize: 36,
                  color: "#e8e6e1",
                }}
              >
                {plan.price}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontWeight: fontWeights.regular,
                fontSize: 13,
                color: "#5a5a65",
                marginBottom: plan.priceDetail ? 4 : 20,
              }}
            >
              {plan.period}
            </Text>
            {plan.priceDetail && (
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontWeight: fontWeights.medium,
                  fontSize: 11,
                  color: GOLD,
                  marginBottom: 20,
                  fontStyle: "italic",
                }}
              >
                {plan.priceDetail}
              </Text>
            )}

            {/* Features */}
            {plan.features.map((feat, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={plan.color}
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontWeight: fontWeights.regular,
                    fontSize: 13,
                    color: "#b0b0b8",
                    flex: 1,
                  }}
                >
                  {feat}
                </Text>
              </View>
            ))}

            {/* CTA */}
            <TouchableOpacity
              onPress={() => router.push("/(auth)/register")}
              style={{
                marginTop: 16,
                paddingVertical: 12,
                borderRadius: 10,
                backgroundColor: plan.popular ? plan.color : "rgba(255,255,255,0.06)",
                borderWidth: plan.popular ? 0 : 1,
                borderColor: "rgba(255,255,255,0.08)",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontWeight: fontWeights.bold,
                  fontSize: 14,
                  color: plan.popular ? "#fff" : "#e8e6e1",
                }}
              >
                {plan.tag === "FREE" ? "Essayer gratuitement" : "Commencer"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}
