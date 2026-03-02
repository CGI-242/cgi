import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useTranslation } from "react-i18next";

export default function LandingHeader() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderBottomColor: colors.border },
      ]}
    >
      <View style={styles.inner}>
        <Text style={[styles.logo, { color: colors.primary }]}>CGI242</Text>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.ghostBtn, { borderColor: colors.primary }]}
            onPress={() => router.push("/(auth)")}
          >
            <Text style={[styles.ghostBtnText, { color: colors.primary }]}>
              {t("landing.login")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filledBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/(auth)/register")}
          >
            <Text style={styles.filledBtnText}>
              {t("landing.getStarted")} →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "sticky" as any,
    top: 0,
    zIndex: 100,
    borderBottomWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
  },
  logo: {
    fontSize: 24,
    fontWeight: "900",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ghostBtn: {
    borderWidth: 1,
    borderRadius: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  ghostBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  filledBtn: {
    borderRadius: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  filledBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
