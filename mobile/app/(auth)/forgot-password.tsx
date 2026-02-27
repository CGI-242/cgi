import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";
import { useTheme } from "@/lib/theme/ThemeContext";
import { authApi } from "@/lib/api/auth";
import axios from "axios";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [emailLocal, setEmailLocal] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setEmail = useAuthStore((s) => s.setEmail);
  const setDevCode = useAuthStore((s) => s.setDevCode);

  const handleSendCode = async () => {
    if (!emailLocal.trim()) {
      setError(t("auth.emailRequired"));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailLocal.trim())) {
      setError(t("auth.emailInvalid"));
      return;
    }
    setError("");
    setLoading(true);

    try {
      const data = await authApi.forgotPassword({ email: emailLocal.trim() });
      setEmail(emailLocal.trim());
      if (__DEV__ && data.devCode) setDevCode(data.devCode);
      router.push("/(auth)/reset-password");
    } catch (err) {
      setError((axios.isAxiosError(err) && err.response?.data?.error) || t("auth.sendError"));
    } finally {
      setLoading(false);
    }
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

          <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text, marginBottom: 4 }}>
            {t("auth.forgotPassword")}
          </Text>
          <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 24 }}>
            {t("auth.enterEmailReset")}
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
            value={emailLocal}
            onChangeText={(text) => {
              setEmailLocal(text);
              setError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleSendCode}
          />

          {/* Bouton */}
          <TouchableOpacity
            style={{ width: "100%", backgroundColor: colors.primary, padding: 16, alignItems: "center", opacity: loading ? 0.7 : 1 }}
            onPress={handleSendCode}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
                {t("auth.sendCode")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Retour */}
          <TouchableOpacity style={{ alignItems: "center", marginTop: 16 }} onPress={() => router.replace("/(auth)")}>
            <Text style={{ fontSize: 14, color: colors.primary, textDecorationLine: "underline" }}>
              {t("auth.backToLogin")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
