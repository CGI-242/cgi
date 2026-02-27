import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";
import { authApi } from "@/lib/api/auth";
import axios from "axios";

const FEEDBACK_DISPLAY_MS = 3_000;

export default function VerifyOtp() {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const email = useAuthStore((s) => s.email);
  const devCode = useAuthStore((s) => s.devCode);
  const setDevCode = useAuthStore((s) => s.setDevCode);
  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    authApi.sendOtpEmail(email).then((data) => {
      if (data.devCode) setDevCode(data.devCode);
    }).catch(() => {});
  }, [email]);

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError(t("auth.codeDigits"));
      return;
    }
    setError("");
    setLoading(true);

    try {
      const data = await authApi.verifyOtp({ email, otp: code });

      // MFA activé : rediriger vers la vérification TOTP
      if (data.requireMFA && data.mfaToken) {
        router.replace({ pathname: "/(auth)/mfa-verify", params: { mfaToken: data.mfaToken } });
        return;
      }

      // Pas de MFA : login normal
      if (data.user || user) {
        await login(data.user || user!, data.token, data.refreshToken);
      }
      router.replace("/(app)");
    } catch (err) {
      setError((axios.isAxiosError(err) && err.response?.data?.error) || t("auth.invalidCode"));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const data = await authApi.sendOtpEmail(email);
      if (data.devCode) setDevCode(data.devCode);
      setSuccess(t("auth.resendSuccess"));
      setTimeout(() => setSuccess(""), FEEDBACK_DISPLAY_MS);
    } catch {
      setError(t("auth.resendError"));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <View className="flex-1 justify-center items-center px-6">
        <View className="w-full max-w-[420px] bg-card p-8">
          {/* Logo */}
          <View className="items-center mb-6">
            <Text className="text-4xl font-bold text-primary">CGI242</Text>
            <Text className="text-sm text-muted mt-1">
              Intelligence Fiscale IA
            </Text>
          </View>

          <Text className="text-2xl font-bold text-text mb-1">
            {t("auth.verification")}
          </Text>
          <Text className="text-sm text-muted mb-6">
            {t("auth.enterCodeSentTo", { email })}
          </Text>

          {/* Dev code - visible si NODE_ENV != production */}
          {devCode ? (
            <View className="border border-dashed border-success bg-green-50 p-4 mb-4 items-center">
              <Text className="text-xs text-muted mb-1">{t("auth.codeDev")}</Text>
              <Text className="text-3xl font-bold text-success tracking-widest">
                {devCode}
              </Text>
            </View>
          ) : null}

          {/* Messages */}
          {error ? (
            <View className="bg-red-50 p-3 mb-4">
              <Text className="text-danger text-sm">{error}</Text>
            </View>
          ) : null}
          {success ? (
            <View className="bg-green-50 p-3 mb-4">
              <Text className="text-success text-sm">{success}</Text>
            </View>
          ) : null}

          {/* Code input */}
          <Text className="text-sm font-semibold text-text mb-2">
            {t("auth.codePlaceholder")}
          </Text>
          <TextInput
            className="w-full bg-input  p-3 text-center text-2xl tracking-widest text-text mb-4 border-0"
            placeholder="000000"
            placeholderTextColor="#888"
            value={code}
            onChangeText={(text) => {
              const cleaned = text.replace(/[^0-9]/g, "").slice(0, 6);
              setCode(cleaned);
              setError("");
            }}
            keyboardType="number-pad"
            maxLength={6}
            returnKeyType="done"
            onSubmitEditing={handleVerify}
          />

          {/* Bouton */}
          <TouchableOpacity
            className="w-full bg-primary p-4 items-center"
            onPress={handleVerify}
            activeOpacity={0.8}
            disabled={loading || code.length !== 6}
            style={loading || code.length !== 6 ? { opacity: 0.7 } : undefined}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                {t("auth.verify")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Renvoyer */}
          <TouchableOpacity className="items-center mt-4" onPress={handleResend}>
            <Text className="text-sm text-primary underline">
              {t("auth.resendCode")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
