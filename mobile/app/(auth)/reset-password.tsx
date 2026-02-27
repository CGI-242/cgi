import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useState, useEffect, useRef } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";
import { useTheme } from "@/lib/theme/ThemeContext";
import { authApi } from "@/lib/api/auth";
import axios from "axios";

const REDIRECT_DELAY_MS = 2_000;
const FEEDBACK_DISPLAY_MS = 3_000;
const RESEND_COOLDOWN_S = 60;

export default function ResetPassword() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const email = useAuthStore((s) => s.email);
  const devCode = useAuthStore((s) => s.devCode);
  const setDevCode = useAuthStore((s) => s.setDevCode);

  // Nettoyage des timers au démontage (M6)
  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, []);

  const handleReset = async () => {
    if (code.length !== 6) {
      setError(t("auth.codeDigits"));
      return;
    }
    if (password.length < 12) {
      setError(t("auth.passwordMinLength"));
      return;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      setError(t("auth.passwordComplexity"));
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
      redirectTimerRef.current = setTimeout(() => {
        router.replace("/(auth)");
      }, REDIRECT_DELAY_MS);
    } catch (err) {
      setError((axios.isAxiosError(err) && err.response?.data?.error) || t("auth.resetError"));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      const data = await authApi.forgotPassword({ email });
      if (__DEV__ && data.devCode) setDevCode(data.devCode);
      setSuccess(t("auth.resendSuccess"));
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = setTimeout(() => setSuccess(""), FEEDBACK_DISPLAY_MS);
      // Cooldown anti-spam (M9)
      setCooldown(RESEND_COOLDOWN_S);
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
      cooldownTimerRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(cooldownTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setError(t("auth.resendError"));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }}>
        <View style={{ width: "100%", maxWidth: 420, backgroundColor: colors.card, padding: 32, borderRadius: 12 }}>
          {/* Logo */}
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <Text style={{ fontSize: 36, fontWeight: "700", color: colors.primary }}>CGI242</Text>
            <Text style={{ fontSize: 14, color: colors.textMuted, marginTop: 4 }}>
              Intelligence Fiscale IA
            </Text>
          </View>

          <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text, marginBottom: 4 }}>
            {t("auth.resetPassword")}
          </Text>
          <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 24 }}>
            {t("auth.enterCodeAndPassword")}
          </Text>

          {/* Dev code - visible uniquement en développement */}
          {__DEV__ && devCode ? (
            <View style={{ borderWidth: 1, borderStyle: "dashed", borderColor: colors.success, backgroundColor: colors.success + "15", padding: 16, marginBottom: 16, alignItems: "center", borderRadius: 8 }}>
              <Text style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>{t("auth.codeDev")}</Text>
              <Text style={{ fontSize: 30, fontWeight: "700", color: colors.success, letterSpacing: 4 }}>
                {devCode}
              </Text>
            </View>
          ) : null}

          {/* Messages */}
          {error ? (
            <View style={{ backgroundColor: colors.danger + "15", padding: 12, marginBottom: 16, borderRadius: 8 }}>
              <Text style={{ color: colors.danger, fontSize: 14 }}>{error}</Text>
            </View>
          ) : null}
          {success ? (
            <View style={{ backgroundColor: colors.success + "15", padding: 12, marginBottom: 16, borderRadius: 8 }}>
              <Text style={{ color: colors.success, fontSize: 14 }}>{success}</Text>
            </View>
          ) : null}

          {/* Code */}
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
            {t("auth.codePlaceholder")}
          </Text>
          <TextInput
            style={{ width: "100%", backgroundColor: colors.input, padding: 12, textAlign: "center", fontSize: 24, letterSpacing: 4, color: colors.text, marginBottom: 16, borderRadius: 8 }}
            placeholder="000000"
            placeholderTextColor={colors.textMuted}
            value={code}
            onChangeText={(text) => {
              setCode(text.replace(/[^0-9]/g, "").slice(0, 6));
              setError("");
            }}
            keyboardType="number-pad"
            maxLength={6}
          />

          {/* Nouveau mot de passe */}
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
            {t("auth.newPassword")} <Text style={{ color: colors.danger }}>*</Text>
          </Text>
          <View style={{ marginBottom: 16 }}>
            <TextInput
              style={{ width: "100%", backgroundColor: colors.input, padding: 12, paddingRight: 48, fontSize: 16, color: colors.text, borderRadius: 8 }}
              placeholder={t("auth.passwordPlaceholder")}
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={(v) => { setPassword(v); setError(""); }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={{ position: "absolute", right: 12, top: 12 }}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          {/* Confirmer */}
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
            {t("auth.confirmPassword")} <Text style={{ color: colors.danger }}>*</Text>
          </Text>
          <TextInput
            style={{ width: "100%", backgroundColor: colors.input, padding: 12, fontSize: 16, color: colors.text, marginBottom: 16, borderRadius: 8 }}
            placeholder={t("auth.confirmPassword")}
            placeholderTextColor={colors.textMuted}
            value={confirmPassword}
            onChangeText={(v) => { setConfirmPassword(v); setError(""); }}
            secureTextEntry={!showPassword}
          />

          {/* Bouton */}
          <TouchableOpacity
            style={{ width: "100%", backgroundColor: colors.primary, padding: 16, alignItems: "center", borderRadius: 8, opacity: loading ? 0.7 : 1 }}
            onPress={handleReset}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
                {t("auth.resetPassword")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Liens */}
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 16, marginTop: 16 }}>
            <TouchableOpacity onPress={handleResend} disabled={cooldown > 0}>
              <Text style={{ fontSize: 14, color: cooldown > 0 ? colors.textMuted : colors.primary, textDecorationLine: cooldown > 0 ? "none" : "underline" }}>
                {cooldown > 0 ? t("auth.resendCooldown", { seconds: cooldown }) : t("auth.resendCode")}
              </Text>
            </TouchableOpacity>
            <Text style={{ color: colors.textMuted }}>·</Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)")}>
              <Text style={{ fontSize: 14, color: colors.primary, textDecorationLine: "underline" }}>
                {t("auth.backToLogin")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
