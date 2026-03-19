import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";
import { useResponsive } from "@/lib/hooks/useResponsive";
import { authApi } from "@/lib/api/auth";
import axios from "axios";
import { fonts, fontWeights } from "@/lib/theme/fonts";
import AuthLogo from "@/components/auth/AuthLogo";
import TurnstileWidget from "@/components/auth/TurnstileWidget";

const BG = "#1A3A5C";
const GOLD = "#D4A843";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();
  const [emailLocal, setEmailLocal] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

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
      const data = await authApi.forgotPassword({ email: emailLocal.trim(), turnstileToken: turnstileToken ?? undefined });
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
      style={{ flex: 1, backgroundColor: "#ffffff" }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: isMobile ? 16 : 24 }}>
        <View style={{ width: "100%", maxWidth: isMobile ? undefined : 440, backgroundColor: BG, padding: isMobile ? 20 : 32, borderRadius: 16 }}>
          <AuthLogo />

          <Text style={{ fontFamily: fonts.heading, fontWeight: fontWeights.heading, fontSize: 26, color: "#e8e6e1", marginBottom: 4 }}>
            {t("auth.forgotPassword")}
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 16, color: "rgba(255,255,255,0.55)", marginBottom: 24 }}>
            {t("auth.enterEmailReset")}
          </Text>

          {/* Erreur */}
          {error ? (
            <View style={{ backgroundColor: "rgba(239,68,68,0.08)", padding: 12, marginBottom: 16, borderRadius: 8 }}>
              <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, color: "#ef4444", fontSize: 16 }}>{error}</Text>
            </View>
          ) : null}

          {/* Email */}
          <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 16, color: "#e8e6e1", marginBottom: 8 }}>
            Email <Text style={{ color: "#f87171" }}>*</Text>
          </Text>
          <TextInput
            style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, width: "100%", backgroundColor: "rgba(255,255,255,0.08)", padding: 12, fontSize: 18, color: "#e8e6e1", marginBottom: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 8 }}
            placeholder={t("auth.emailPlaceholder")}
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={emailLocal}
            onChangeText={(text) => {
              setEmailLocal(text);
              setError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleSendCode}
            accessibilityLabel={t("auth.emailPlaceholder")}
          />

          <TurnstileWidget onToken={setTurnstileToken} />

          {/* Bouton */}
          <TouchableOpacity
            style={{ width: "100%", backgroundColor: GOLD, padding: 16, alignItems: "center", borderRadius: 10, opacity: loading ? 0.7 : 1 }}
            onPress={handleSendCode}
            activeOpacity={0.8}
            disabled={loading}
            accessibilityLabel={t("auth.sendCode")}
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, color: BG, fontSize: 18 }}>
                {t("auth.sendCode")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Retour */}
          <TouchableOpacity style={{ alignItems: "center", marginTop: 16 }} onPress={() => router.replace("/(auth)")} accessibilityLabel={t("auth.backToLogin")} accessibilityRole="link">
            <Text style={{ fontFamily: fonts.medium, fontWeight: fontWeights.medium, fontSize: 16, color: GOLD, textDecorationLine: "underline" }}>
              {t("auth.backToLogin")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
