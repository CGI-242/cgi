import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

interface Props {
  isMobile: boolean;
}

export default function LandingHero({ isMobile }: Props) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <View style={[styles.inner, { paddingHorizontal: isMobile ? 20 : 40 }]}>
        <Text style={[styles.title, { fontSize: isMobile ? 30 : 44 }]}>
          {t("landing.heroTitle")}{"\n"}
          <Text style={styles.titleAccent}>{t("landing.heroTitleAccent")}</Text>
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              fontSize: isMobile ? 16 : 20,
              maxWidth: isMobile ? width - 40 : 640,
            },
          ]}
        >
          {t("landing.heroSubtitle")}
        </Text>

        <View style={[styles.buttons, { flexDirection: isMobile ? "column" : "row" }]}>
          <TouchableOpacity
            style={styles.ctaPrimary}
            onPress={() => router.push("/(auth)/register")}
          >
            <Text style={styles.ctaPrimaryText}>{t("landing.heroCtaPrimary")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ctaOutline}
            onPress={() => router.push("/(auth)")}
          >
            <Text style={styles.ctaOutlineText}>{t("landing.login")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#00815d",
    paddingVertical: 80,
    alignItems: "center",
  },
  inner: {
    alignItems: "center",
    maxWidth: 1200,
    width: "100%",
  },
  title: {
    color: "#ffffff",
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 52,
  },
  titleAccent: {
    color: "#00c17c",
  },
  subtitle: {
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 28,
  },
  buttons: {
    marginTop: 36,
    gap: 14,
    alignItems: "center",
  },
  ctaPrimary: {
    backgroundColor: "#ffffff",
    borderRadius: 0,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  ctaPrimaryText: {
    color: "#00815d",
    fontSize: 16,
    fontWeight: "700",
  },
  ctaOutline: {
    borderWidth: 2,
    borderColor: "#ffffff",
    borderRadius: 0,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  ctaOutlineText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
