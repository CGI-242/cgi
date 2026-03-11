import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Linking } from "react-native";
import { useState, useCallback } from "react";
import { router, useFocusEffect, type Href } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/lib/store/auth";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useResponsive } from "@/lib/hooks/useResponsive";
import { fonts, fontWeights } from "@/lib/theme/fonts";
import AuthLogo from "@/components/auth/AuthLogo";

const CONTACT_EMAIL = "mailto:support@normx-ai.com?subject=Aide%20CGI242";

export default function LoginEmail() {
  const { t } = useTranslation();
  const { colors, mode, toggleTheme } = useTheme();
  const { isMobile } = useResponsive();
  const [email, setEmailLocal] = useState("");
  const [error, setError] = useState("");
  const [navigating, setNavigating] = useState(false);
  const setEmail = useAuthStore((s) => s.setEmail);

  useFocusEffect(useCallback(() => { setNavigating(false); }, []));

  const handleContinue = () => {
    if (navigating) return;
    if (!email.trim()) {
      setError(t("auth.emailRequired"));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError(t("auth.emailInvalid"));
      return;
    }
    setError("");
    setNavigating(true);
    setEmail(email.trim());
    router.push("/(auth)/password");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: isMobile ? 16 : 24 }}>
        <View style={{ width: "100%", maxWidth: isMobile ? undefined : 440, backgroundColor: colors.card, padding: isMobile ? 24 : 40, borderWidth: 1, borderColor: colors.border }}>
          <AuthLogo size="lg" />

          {/* Titre */}
          <Text style={{ fontFamily: fonts.heading, fontWeight: fontWeights.heading, fontSize: 26, color: colors.text, marginBottom: 6 }}>{t("auth.login")}</Text>
          <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 16, color: colors.textMuted, marginBottom: 28 }}>
            {t("auth.enterEmail")}
          </Text>

          {/* Erreur */}
          {error ? (
            <View style={{ backgroundColor: colors.danger + "15", padding: 12, marginBottom: 16 }}>
              <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, color: colors.danger, fontSize: 16 }}>{error}</Text>
            </View>
          ) : null}

          {/* Email */}
          <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 16, color: colors.text, marginBottom: 10 }}>
            Email <Text style={{ color: colors.danger }}>*</Text>
          </Text>
          <TextInput
            style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, width: "100%", backgroundColor: colors.input, padding: 14, fontSize: 18, color: colors.text, marginBottom: 24, borderWidth: 1, borderColor: colors.border }}
            placeholder={t("auth.emailPlaceholder")}
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={(text) => {
              setEmailLocal(text);
              setError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
            onSubmitEditing={handleContinue}
            accessibilityLabel={t("auth.emailPlaceholder")}
          />

          {/* Bouton */}
          <TouchableOpacity
            style={{ width: "100%", backgroundColor: colors.primary, padding: 16, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, marginTop: 4, opacity: navigating ? 0.7 : 1 }}
            onPress={handleContinue}
            activeOpacity={0.8}
            disabled={navigating}
            accessibilityLabel={t("auth.continue")}
            accessibilityRole="button"
          >
            <Ionicons name="person" size={18} color={colors.sidebar} />
            {!isMobile && (
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, color: colors.sidebar, fontSize: 18 }}>
                {t("auth.continue")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Lien inscription */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 28 }}>
            <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 16, color: colors.textMuted }}>{t("auth.noAccount")} </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")} accessibilityLabel={t("auth.createCompany")} accessibilityRole="link">
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 16, color: colors.primary, textDecorationLine: "underline" }}>
                {t("auth.createCompany")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={{ flexDirection: "row", gap: 24, marginTop: 24, alignItems: "center" }}>
          <TouchableOpacity onPress={toggleTheme} style={{ padding: 6 }} accessibilityLabel={t("auth.toggleTheme")} accessibilityRole="button">
            <Ionicons name={mode === "dark" ? "sunny-outline" : "moon-outline"} size={18} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(CONTACT_EMAIL)}>
            <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 14, color: colors.textMuted, textDecorationLine: "underline" }}>{t("auth.help")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/legal/confidentialite" as Href)}>
            <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 14, color: colors.textMuted, textDecorationLine: "underline" }}>{t("auth.privacy")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/legal/cgu" as Href)}>
            <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 14, color: colors.textMuted, textDecorationLine: "underline" }}>{t("auth.terms")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/legal/mentions" as Href)}>
            <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 14, color: colors.textMuted, textDecorationLine: "underline" }}>{t("settings.legalNotices")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
