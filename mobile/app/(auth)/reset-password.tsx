import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useState, useEffect, useRef } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useResponsive } from "@/lib/hooks/useResponsive";
import { authApi } from "@/lib/api/auth";
import axios from "axios";
import OtpInput from "@/components/auth/OtpInput";
import PasswordStrengthIndicator from "@/components/auth/PasswordStrengthIndicator";
import { fonts, fontWeights } from "@/lib/theme/fonts";
import AuthLogo from "@/components/auth/AuthLogo";

const REDIRECT_DELAY_MS = 2_000;
const FEEDBACK_DISPLAY_MS = 3_000;
const RESEND_COOLDOWN_S = 60;

export default function ResetPassword() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isMobile } = useResponsive();
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: isMobile ? 16 : 24 }}>
        <View style={{ width: "100%", maxWidth: isMobile ? undefined : 420, backgroundColor: colors.card, padding: isMobile ? 20 : 32 }}>
          <AuthLogo />

          <Text style={{ fontFamily: fonts.heading, fontWeight: fontWeights.heading, fontSize: 26, color: colors.text, marginBottom: 4 }}>
            {t("auth.resetPassword")}
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 16, color: colors.textMuted, marginBottom: 24 }}>
            {t("auth.enterCodeAndPassword")}
          </Text>

          {/* Dev code - visible uniquement en développement */}
          {__DEV__ && devCode ? (
            <View style={{ borderWidth: 1, borderStyle: "dashed", borderColor: colors.success, backgroundColor: colors.success + "15", padding: 16, marginBottom: 16, alignItems: "center" }}>
              <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 14, color: colors.textMuted, marginBottom: 4 }}>{t("auth.codeDev")}</Text>
              <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 32, color: colors.success, letterSpacing: 4 }}>
                {devCode}
              </Text>
            </View>
          ) : null}

          {/* Messages */}
          {error ? (
            <View style={{ backgroundColor: colors.danger + "15", padding: 12, marginBottom: 16 }}>
              <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, color: colors.danger, fontSize: 16 }}>{error}</Text>
            </View>
          ) : null}
          {success ? (
            <View style={{ backgroundColor: colors.success + "15", padding: 12, marginBottom: 16 }}>
              <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, color: colors.success, fontSize: 16 }}>{success}</Text>
            </View>
          ) : null}

          {/* Code */}
          <OtpInput
            code={code}
            cooldown={cooldown}
            onChangeCode={(cleaned) => { setCode(cleaned); setError(""); }}
            onResend={handleResend}
            colors={colors}
          />

          {/* Nouveau mot de passe */}
          <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 16, color: colors.text, marginBottom: 8 }}>
            {t("auth.newPassword")} <Text style={{ color: colors.danger }}>*</Text>
          </Text>
          <View style={{ marginBottom: 16 }}>
            <TextInput
              style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, width: "100%", backgroundColor: colors.input, padding: 12, paddingRight: 48, fontSize: 18, color: colors.text }}
              placeholder={t("auth.passwordPlaceholder")}
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={(v) => { setPassword(v); setError(""); }}
              secureTextEntry={!showPassword}
              accessibilityLabel={t("auth.newPassword")}
            />
            <TouchableOpacity
              style={{ position: "absolute", right: 12, top: 12 }}
              onPress={() => setShowPassword(!showPassword)}
              accessibilityLabel={t("auth.togglePassword")}
              accessibilityRole="button"
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          <PasswordStrengthIndicator password={password} colors={colors} />

          {/* Confirmer */}
          <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 16, color: colors.text, marginBottom: 8 }}>
            {t("auth.confirmPassword")} <Text style={{ color: colors.danger }}>*</Text>
          </Text>
          <TextInput
            style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, width: "100%", backgroundColor: colors.input, padding: 12, fontSize: 18, color: colors.text, marginBottom: 16 }}
            placeholder={t("auth.confirmPassword")}
            placeholderTextColor={colors.textMuted}
            value={confirmPassword}
            onChangeText={(v) => { setConfirmPassword(v); setError(""); }}
            secureTextEntry={!showPassword}
            accessibilityLabel={t("auth.confirmPassword")}
          />

          {/* Bouton */}
          <TouchableOpacity
            style={{ width: "100%", backgroundColor: colors.primary, padding: 16, alignItems: "center", opacity: loading ? 0.7 : 1 }}
            onPress={handleReset}
            activeOpacity={0.8}
            disabled={loading}
            accessibilityLabel={t("auth.resetPassword")}
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, color: colors.sidebarText, fontSize: 18 }}>
                {t("auth.resetPassword")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Renvoyer le code */}
          <TouchableOpacity style={{ alignItems: "center", marginTop: 20 }} onPress={handleResend} disabled={cooldown > 0} accessibilityLabel={t("auth.resendCode")} accessibilityRole="button">
            <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 16, color: cooldown > 0 ? colors.textMuted : colors.primary, textDecorationLine: cooldown > 0 ? "none" : "underline" }}>
              {cooldown > 0 ? t("auth.resendCooldown", { seconds: cooldown }) : t("auth.resendCode")}
            </Text>
          </TouchableOpacity>

          {/* Lien retour */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 16 }}>
            <TouchableOpacity onPress={() => router.replace("/(auth)")} accessibilityLabel={t("auth.backToLogin")} accessibilityRole="link">
              <Text style={{ fontFamily: fonts.medium, fontWeight: fontWeights.medium, fontSize: 16, color: colors.primary, textDecorationLine: "underline" }}>
                {t("auth.backToLogin")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
