import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { fonts, fontWeights } from "@/lib/theme/fonts";

const GOLD = "#D4A843";

interface Props {
  isMobile: boolean;
  loaded: boolean;
}

export default function LandingHero({ isMobile, loaded }: Props) {
  const { t } = useTranslation();

  const stats = [
    { value: "2 263", label: t("landing.statsArticles") },
    { value: "16", label: t("landing.statsSimulators") },
    { value: "64", label: t("landing.statsTexts") },
    { value: "2026", label: t("landing.statsEdition") },
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
        <Text style={{ fontSize: 26 }}>🇨🇬</Text>
        <Text style={{ fontSize: 14, fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, color: GOLD }}>
          Congo-Brazzaville — Édition 2026
        </Text>
      </View>

      {/* Title */}
      <Text
        style={{
          fontFamily: fonts.headingBlack,
          fontWeight: fontWeights.headingBlack,
          fontSize: isMobile ? 32 : 56,
          color: "#1A3A5C",
          textAlign: "center",
          lineHeight: isMobile ? 38 : 64,
          marginBottom: 20,
        }}
      >
        {t("landing.heroTitle")}{"\n"}
        <Text style={{ color: GOLD }}>{t("landing.heroTitleAccent")}</Text>
      </Text>

      {/* Subtitle */}
      <Text
        style={{
          fontSize: isMobile ? 15 : 19,
          color: "#6b7280",
          maxWidth: 600,
          textAlign: "center",
          lineHeight: isMobile ? 24 : 31,
          fontFamily: fonts.light,
          fontWeight: fontWeights.light,
          marginBottom: 44,
        }}
      >
        {t("landing.heroSubtitle")}
      </Text>

      {/* Stats */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: isMobile ? 24 : 56,
          flexWrap: "wrap",
          marginBottom: 50,
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
                color: "#9ca3af",
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
          <Text style={{ color: "#fff", fontSize: 18, fontFamily: fonts.extraBold, fontWeight: fontWeights.extraBold }}>
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
            borderColor: "rgba(0,0,0,0.12)",
          }}
        >
          <Text style={{ color: "#1A3A5C", fontSize: 18, fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold }}>
            {t("landing.login")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
