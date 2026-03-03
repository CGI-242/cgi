import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useState, useEffect, useRef } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";
import { useTheme } from "@/lib/theme/ThemeContext";
import { authApi } from "@/lib/api/auth";
import axios from "axios";
import OtpInput from "@/components/auth/OtpInput";
import { createLogger } from "@/lib/utils/logger";

const log = createLogger("otp");

const FEEDBACK_DISPLAY_MS = 3_000;
const RESEND_COOLDOWN_S = 60;

export default function VerifyOtp() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const email = useAuthStore((s) => s.email);
  const devCode = useAuthStore((s) => s.devCode);
  const setDevCode = useAuthStore((s) => s.setDevCode);
  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);
  const rememberMe = useAuthStore((s) => s.rememberMe);

  useEffect(() => {
    authApi.sendOtpEmail(email).then((data) => {
      if (data.devCode) setDevCode(data.devCode);
    }).catch((err) => log.warn("Erreur envoi OTP initial", err));
  }, [email]);

  // Nettoyage des timers au démontage (M6)
  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, []);

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError(t("auth.codeDigits"));
      return;
    }
    setError("");
    setLoading(true);

    try {
      const data = await authApi.verifyOtp({ email, otp: code, rememberMe });

      // MFA activé : rediriger vers la vérification TOTP
      if (data.requireMFA && data.mfaToken) {
        router.replace({ pathname: "/(auth)/mfa-verify", params: { mfaToken: data.mfaToken } });
        return;
      }

      // Pas de MFA : login normal
      const loginUser = data.user || user;
      if (!loginUser) {
        setError(t("auth.invalidCode"));
        return;
      }
      await login(loginUser, data.token, data.refreshToken);
      router.replace("/(app)");
    } catch (err) {
      setError((axios.isAxiosError(err) && err.response?.data?.error) || t("auth.invalidCode"));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      const data = await authApi.sendOtpEmail(email);
      if (data.devCode) setDevCode(data.devCode);
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
        <View style={{ width: "100%", maxWidth: 420, backgroundColor: colors.card, padding: 32 }}>
          {/* Logo */}
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <Text style={{ fontSize: 36, fontWeight: "700", color: colors.primary }}>CGI242</Text>
            <Text style={{ fontSize: 14, color: colors.textMuted, marginTop: 4 }}>
              Intelligence Fiscale IA
            </Text>
          </View>

          <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text, marginBottom: 4 }}>
            {t("auth.verification")}
          </Text>
          <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 24 }}>
            {t("auth.enterCodeSentTo", { email })}
          </Text>

          {/* Dev code - visible uniquement en mode développement */}
          {__DEV__ && devCode ? (
            <View style={{ borderWidth: 1, borderStyle: "dashed", borderColor: colors.success, backgroundColor: colors.success + "15", padding: 16, marginBottom: 16, alignItems: "center" }}>
              <Text style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>{t("auth.codeDev")}</Text>
              <Text style={{ fontSize: 30, fontWeight: "700", color: colors.success, letterSpacing: 4 }}>
                {devCode}
              </Text>
            </View>
          ) : null}

          {/* Messages */}
          {error ? (
            <View style={{ backgroundColor: colors.danger + "15", padding: 12, marginBottom: 16 }}>
              <Text style={{ color: colors.danger, fontSize: 14 }}>{error}</Text>
            </View>
          ) : null}
          {success ? (
            <View style={{ backgroundColor: colors.success + "15", padding: 12, marginBottom: 16 }}>
              <Text style={{ color: colors.success, fontSize: 14 }}>{success}</Text>
            </View>
          ) : null}

          {/* Code input */}
          <OtpInput
            code={code}
            cooldown={cooldown}
            onChangeCode={(cleaned) => { setCode(cleaned); setError(""); }}
            onResend={handleResend}
            onSubmit={handleVerify}
            colors={colors}
          />

          {/* Bouton */}
          <TouchableOpacity
            style={{ width: "100%", backgroundColor: colors.primary, padding: 16, alignItems: "center", opacity: loading || code.length !== 6 ? 0.7 : 1 }}
            onPress={handleVerify}
            activeOpacity={0.8}
            disabled={loading || code.length !== 6}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
                {t("auth.verify")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Renvoyer - handled by OtpInput component above */}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
