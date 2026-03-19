import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";
import { useResponsive } from "@/lib/hooks/useResponsive";
import { api } from "@/lib/api/client";
import axios from "axios";
import { fonts, fontWeights } from "@/lib/theme/fonts";
import AuthLogo from "@/components/auth/AuthLogo";

const BG = "#1A3A5C";
const GOLD = "#D4A843";

export default function MfaVerify() {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();
  const { mfaToken } = useLocalSearchParams<{ mfaToken: string }>();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((s) => s.login);

  const handleVerify = async () => {
    if (code.length < 6) {
      setError(t("auth.mfaEnterCode"));
      return;
    }
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/mfa/verify", { mfaToken, code });
      if (data.user) {
        await login(data.user, data.token, data.refreshToken);
      }
      router.replace("/(app)");
    } catch (err) {
      setError(
        (axios.isAxiosError(err) && err.response?.data?.error) || t("auth.mfaInvalid")
      );
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
            {t("auth.mfaTitle")}
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 16, color: "rgba(255,255,255,0.55)", marginBottom: 24 }}>
            {t("auth.mfaDesc")}
          </Text>

          {/* Messages */}
          {error ? (
            <View style={{ backgroundColor: "rgba(239,68,68,0.08)", padding: 12, marginBottom: 16, borderRadius: 8 }}>
              <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, color: "#ef4444", fontSize: 16 }}>{error}</Text>
            </View>
          ) : null}

          {/* Code input */}
          <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 16, color: "#e8e6e1", marginBottom: 8 }}>
            {t("auth.mfaPlaceholder")}
          </Text>
          <TextInput
            style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, width: "100%", backgroundColor: "rgba(255,255,255,0.08)", padding: 12, textAlign: "center", fontSize: 26, letterSpacing: 4, color: "#e8e6e1", marginBottom: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 8 }}
            placeholder="000000"
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={code}
            onChangeText={(text) => {
              setCode(text.replace(/[^0-9A-Za-z\-]/g, "").slice(0, 6));
              setError("");
            }}
            keyboardType="default"
            maxLength={6}
            autoCapitalize="characters"
            returnKeyType="done"
            onSubmitEditing={handleVerify}
            accessibilityLabel={t("auth.mfaPlaceholder")}
          />

          {/* Bouton */}
          <TouchableOpacity
            style={{ width: "100%", backgroundColor: GOLD, padding: 16, alignItems: "center", borderRadius: 10, opacity: loading || code.length < 6 ? 0.7 : 1 }}
            onPress={handleVerify}
            activeOpacity={0.8}
            disabled={loading || code.length < 6}
            accessibilityLabel={t("auth.verify")}
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, color: BG, fontSize: 18 }}>
                {t("auth.verify")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Retour */}
          <TouchableOpacity
            style={{ alignItems: "center", marginTop: 16 }}
            onPress={() => router.replace("/(auth)/password")}
            accessibilityLabel={t("auth.backToLogin")}
            accessibilityRole="link"
          >
            <Text style={{ fontFamily: fonts.medium, fontWeight: fontWeights.medium, fontSize: 16, color: GOLD, textDecorationLine: "underline" }}>
              {t("auth.backToLogin")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
