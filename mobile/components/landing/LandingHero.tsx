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
    { value: "1", label: "Pays couvert" },
    { value: "2 263", label: "Articles de loi" },
    { value: "16", label: "Simulateurs" },
    { value: "IA", label: "Assistant intelligent" },
  ];

  return (
    <View style={{ alignItems: "center", paddingTop: isMobile ? 60 : 90, paddingBottom: 50, paddingHorizontal: 24, backgroundColor: "#ffffff" }}>
      {/* Badge */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          backgroundColor: "rgba(26,58,92,0.06)",
          borderWidth: 1,
          borderColor: "rgba(26,58,92,0.12)",
          borderRadius: 100,
          paddingVertical: 7,
          paddingHorizontal: 18,
          marginBottom: 28,
        }}
      >
        <Text style={{ fontSize: 14, fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, color: "#1A3A5C" }}>
          Plateforme IA pour les professionnels africains
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
        {"L'intelligence "}<Text style={{ color: GOLD }}>{"juridique & fiscale"}</Text>{"\n"}à portée de main
      </Text>

      {/* Subtitle */}
      <Text
        style={{
          fontSize: isMobile ? 15 : 19,
          color: "#5a6a7a",
          maxWidth: 640,
          textAlign: "center",
          lineHeight: isMobile ? 24 : 31,
          fontFamily: fonts.light,
          fontWeight: fontWeights.light,
          marginBottom: 44,
        }}
      >
        NORMX AI centralise le droit, la fiscalité, la comptabilité et la paie dans une plateforme unique propulsée par l'intelligence artificielle.
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
          <View key={i} style={{ alignItems: "center", opacity: loaded ? 1 : 0 }}>
            <Text style={{ fontSize: isMobile ? 28 : 40, fontFamily: fonts.black, fontWeight: fontWeights.black, color: "#1A3A5C" }}>
              {stat.value}
            </Text>
            <Text style={{ fontSize: 13, color: "#5a6a7a", textTransform: "uppercase", letterSpacing: 1.5, marginTop: 5, fontFamily: fonts.medium, fontWeight: fontWeights.medium }}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      {/* CTA buttons */}
      <View style={{ flexDirection: isMobile ? "column" : "row", gap: 14, alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => router.push("/cgi242")}
          style={{ paddingVertical: 15, paddingHorizontal: 38, borderRadius: 12, backgroundColor: "#1A3A5C" }}
        >
          <Text style={{ color: "#ffffff", fontSize: 18, fontFamily: fonts.extraBold, fontWeight: fontWeights.extraBold }}>
            Découvrir NORMX Tax →
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          style={{ paddingVertical: 13, paddingHorizontal: 38, borderRadius: 12, borderWidth: 1, borderColor: "rgba(26,58,92,0.2)" }}
        >
          <Text style={{ color: "#1A3A5C", fontSize: 18, fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold }}>
            Essai gratuit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
