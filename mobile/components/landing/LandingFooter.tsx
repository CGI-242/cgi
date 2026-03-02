import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

interface Props {
  isMobile: boolean;
}

export default function LandingFooter({ isMobile }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inner,
          { flexDirection: isMobile ? "column" : "row", gap: isMobile ? 30 : 60 },
        ]}
      >
        <View style={[styles.column, { alignItems: isMobile ? "center" : "flex-start" }]}>
          <Text style={styles.brand}>CGI242</Text>
          <Text style={styles.brandDesc}>{t("landing.footerDesc")}</Text>
        </View>

        <View style={[styles.column, { alignItems: isMobile ? "center" : "flex-start" }]}>
          <Text style={styles.columnTitle}>{t("landing.footerLinks")}</Text>
          <TouchableOpacity onPress={() => router.push("/(auth)")}>
            <Text style={styles.link}>{t("landing.login")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.link}>{t("landing.footerRegister")}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.column, { alignItems: isMobile ? "center" : "flex-start" }]}>
          <Text style={styles.columnTitle}>{t("landing.footerLegal")}</Text>
          <TouchableOpacity onPress={() => Linking.openURL("https://normx-ai.com")}>
            <Text style={styles.link}>NormX AI</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />
      <Text style={styles.copyright}>{t("landing.copyright")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  inner: {
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    gap: 8,
  },
  brand: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 6,
  },
  brandDesc: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    lineHeight: 20,
  },
  columnTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  link: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    marginTop: 30,
    marginBottom: 20,
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
  },
  copyright: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 13,
    textAlign: "center",
  },
});
