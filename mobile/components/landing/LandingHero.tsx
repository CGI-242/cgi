import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { fonts, fontWeights } from "@/lib/theme/fonts";

const GOLD = "#c8a03c";

interface Props {
  isMobile: boolean;
  loaded: boolean;
}

export default function LandingHero({ isMobile, loaded }: Props) {
  const { t } = useTranslation();

  const stats = [
    { value: "22", label: "Pays" },
    { value: "2 248", label: "Articles" },
    { value: "14", label: "Simulateurs" },
    { value: "8", label: "Fonctionnalités" },
  ];

  return (
    <View style={{ alignItems: "center", paddingTop: isMobile ? 60 : 90, paddingBottom: 50, paddingHorizontal: 24 }}>
      {/* Badge */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          backgroundColor: "rgba(200,160,60,0.08)",
          borderWidth: 1,
          borderColor: "rgba(200,160,60,0.18)",
          borderRadius: 100,
          paddingVertical: 7,
          paddingHorizontal: 18,
          marginBottom: 28,
        }}
      >
        <View
          style={{
            width: 7,
            height: 7,
            borderRadius: 4,
            backgroundColor: "#4ade80",
          }}
        />
        <Text style={{ fontSize: 14, fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, color: GOLD }}>
          CGI 242 Congo-Brazzaville disponible
        </Text>
      </View>

      {/* Title */}
      <Text
        style={{
          fontFamily: fonts.headingBlack,
          fontWeight: fontWeights.headingBlack,
          fontSize: isMobile ? 38 : 68,
          color: "#e8e6e1",
          textAlign: "center",
          lineHeight: isMobile ? 42 : 72,
          marginBottom: 20,
        }}
      >
        {"L'intelligence fiscale\n"}
        <Text style={{ color: GOLD }}>africaine</Text>
      </Text>

      {/* Subtitle */}
      <Text
        style={{
          fontSize: isMobile ? 15 : 19,
          color: "#7a7a85",
          maxWidth: 560,
          textAlign: "center",
          lineHeight: isMobile ? 24 : 31,
          fontFamily: fonts.light,
          fontWeight: fontWeights.light,
          marginBottom: 44,
        }}
      >
        22 Codes Généraux des Impôts dans votre poche. Recherche instantanée, simulateurs fiscaux, assistant IA et mode hors-ligne.
      </Text>

      {/* Stats */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: isMobile ? 24 : 56,
          flexWrap: "wrap",
          marginBottom: 60,
        }}
      >
        {stats.map((stat, i) => (
          <View
            key={i}
            style={{
              alignItems: "center",
              opacity: loaded ? 1 : 0,
            }}
          >
            <Text
              style={{
                fontSize: isMobile ? 28 : 40,
                fontFamily: fonts.black,
                fontWeight: fontWeights.black,
                color: GOLD,
              }}
            >
              {stat.value}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "#5a5a65",
                textTransform: "uppercase",
                letterSpacing: 1.5,
                marginTop: 5,
                fontFamily: fonts.medium,
                fontWeight: fontWeights.medium,
              }}
            >
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      {/* CTA buttons */}
      <View style={{ flexDirection: isMobile ? "column" : "row", gap: 14, alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          style={{
            paddingVertical: 15,
            paddingHorizontal: 38,
            borderRadius: 12,
            backgroundColor: GOLD,
          }}
        >
          <Text style={{ color: "#08080d", fontSize: 18, fontFamily: fonts.extraBold, fontWeight: fontWeights.extraBold }}>
            {t("landing.heroCtaPrimary")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)")}
          style={{
            paddingVertical: 13,
            paddingHorizontal: 38,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.12)",
          }}
        >
          <Text style={{ color: "#e8e6e1", fontSize: 18, fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold }}>
            {t("landing.login")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
