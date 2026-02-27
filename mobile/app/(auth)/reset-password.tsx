import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";
import { authApi } from "@/lib/api/auth";
import axios from "axios";

const REDIRECT_DELAY_MS = 2_000;
const FEEDBACK_DISPLAY_MS = 3_000;

export default function ResetPassword() {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const email = useAuthStore((s) => s.email);
  const devCode = useAuthStore((s) => s.devCode);
  const setDevCode = useAuthStore((s) => s.setDevCode);

  const handleReset = async () => {
    if (code.length !== 6) {
      setError(t("auth.codeDigits"));
      return;
    }
    if (password.length < 12) {
      setError(t("auth.passwordMinLength"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("auth.passwordMismatch"));
      return;
    }
    setError("");
    setLoading(true);

    try {
      await authApi.resetPassword({ email, code, newPassword: password });
      setSuccess(t("auth.passwordChanged"));
      setTimeout(() => {
        router.replace("/(auth)");
      }, REDIRECT_DELAY_MS);
    } catch (err) {
      setError((axios.isAxiosError(err) && err.response?.data?.error) || t("auth.resetError"));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const data = await authApi.forgotPassword({ email });
      if (__DEV__ && data.devCode) setDevCode(data.devCode);
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
            {t("auth.resetPassword")}
          </Text>
          <Text className="text-sm text-muted mb-6">
            {t("auth.enterCodeAndPassword")}
          </Text>

          {/* Dev code - visible uniquement en développement */}
          {__DEV__ && devCode ? (
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

          {/* Code */}
          <Text className="text-sm font-semibold text-text mb-2">
            {t("auth.codePlaceholder")}
          </Text>
          <TextInput
            className="w-full bg-input  p-3 text-center text-2xl tracking-widest text-text mb-4 border-0"
            placeholder="000000"
            placeholderTextColor="#888"
            value={code}
            onChangeText={(text) => {
              setCode(text.replace(/[^0-9]/g, "").slice(0, 6));
              setError("");
            }}
            keyboardType="number-pad"
            maxLength={6}
          />

          {/* Nouveau mot de passe */}
          <Text className="text-sm font-semibold text-text mb-2">
            {t("auth.newPassword")} <Text className="text-danger">*</Text>
          </Text>
          <View className="relative mb-4">
            <TextInput
              className="w-full bg-input  p-3 pr-12 text-base text-text border-0"
              placeholder={t("auth.passwordPlaceholder")}
              placeholderTextColor="#888"
              value={password}
              onChangeText={(v) => { setPassword(v); setError(""); }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              className="absolute right-3 top-3"
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          {/* Confirmer */}
          <Text className="text-sm font-semibold text-text mb-2">
            {t("auth.confirmPassword")} <Text className="text-danger">*</Text>
          </Text>
          <TextInput
            className="w-full bg-input  p-3 text-base text-text mb-4 border-0"
            placeholder={t("auth.confirmPassword")}
            placeholderTextColor="#888"
            value={confirmPassword}
            onChangeText={(v) => { setConfirmPassword(v); setError(""); }}
            secureTextEntry={!showPassword}
          />

          {/* Bouton */}
          <TouchableOpacity
            className="w-full bg-primary p-4 items-center"
            onPress={handleReset}
            activeOpacity={0.8}
            disabled={loading}
            style={loading ? { opacity: 0.7 } : undefined}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                {t("auth.resetPassword")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Liens */}
          <View className="flex-row justify-center gap-4 mt-4">
            <TouchableOpacity onPress={handleResend}>
              <Text className="text-sm text-primary underline">
                {t("auth.resendCode")}
              </Text>
            </TouchableOpacity>
            <Text className="text-muted">·</Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)")}>
              <Text className="text-sm text-primary underline">
                {t("auth.backToLogin")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
