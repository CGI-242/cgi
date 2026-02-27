import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Linking } from "react-native";
import { useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";
import { useTheme } from "@/lib/theme/ThemeContext";

const LEGAL_URLS = {
  aide: "https://cgi242.normx.ai/aide",
  confidentialite: "https://cgi242.normx.ai/confidentialite",
  conditions: "https://cgi242.normx.ai/conditions",
};

export default function LoginEmail() {
  const { t } = useTranslation();
  const { colors } = useTheme();
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }}>
        <View style={{ width: "100%", maxWidth: 420, backgroundColor: colors.card, padding: 32 }}>
          {/* Logo */}
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <Text style={{ fontSize: 36, fontWeight: "700", color: colors.primary }}>CGI242</Text>
            <Text style={{ fontSize: 14, color: colors.textMuted, marginTop: 4 }}>
              Intelligence Fiscale IA
            </Text>
          </View>

          {/* Titre */}
          <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text, marginBottom: 4 }}>{t("auth.login")}</Text>
          <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 24 }}>
            {t("auth.enterEmail")}
          </Text>

          {/* Erreur */}
          {error ? (
            <View style={{ backgroundColor: colors.danger + "15", padding: 12, marginBottom: 16 }}>
              <Text style={{ color: colors.danger, fontSize: 14 }}>{error}</Text>
            </View>
          ) : null}

          {/* Email */}
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
            Email <Text style={{ color: colors.danger }}>*</Text>
          </Text>
          <TextInput
            style={{ width: "100%", backgroundColor: colors.input, padding: 12, fontSize: 16, color: colors.text, marginBottom: 16 }}
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
          />

          {/* Bouton */}
          <TouchableOpacity
            style={{ width: "100%", backgroundColor: colors.primary, padding: 16, alignItems: "center", marginTop: 8, opacity: navigating ? 0.7 : 1 }}
            onPress={handleContinue}
            activeOpacity={0.8}
            disabled={navigating}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
              {t("auth.continue")}
            </Text>
          </TouchableOpacity>

          {/* Lien inscription */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 24 }}>
            <Text style={{ fontSize: 14, color: colors.textMuted }}>{t("auth.noAccount")} </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text style={{ fontSize: 14, color: colors.primary, fontWeight: "600", textDecorationLine: "underline" }}>
                {t("auth.createCompany")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={{ flexDirection: "row", gap: 32, marginTop: 24 }}>
          <TouchableOpacity onPress={() => Linking.openURL(LEGAL_URLS.aide)}>
            <Text style={{ fontSize: 12, color: colors.textMuted, textDecorationLine: "underline" }}>{t("auth.help")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(LEGAL_URLS.confidentialite)}>
            <Text style={{ fontSize: 12, color: colors.textMuted, textDecorationLine: "underline" }}>{t("auth.privacy")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(LEGAL_URLS.conditions)}>
            <Text style={{ fontSize: 12, color: colors.textMuted, textDecorationLine: "underline" }}>{t("auth.terms")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
