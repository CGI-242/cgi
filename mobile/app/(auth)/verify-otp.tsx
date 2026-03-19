import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useState, useEffect, useRef } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";
import { useResponsive } from "@/lib/hooks/useResponsive";
import { authApi } from "@/lib/api/auth";
import axios from "axios";
import OtpInput from "@/components/auth/OtpInput";
import { createLogger } from "@/lib/utils/logger";
import { fonts, fontWeights } from "@/lib/theme/fonts";
import AuthLogo from "@/components/auth/AuthLogo";

const log = createLogger("otp");

const BG = "#1A3A5C";
const GOLD = "#D4A843";

const FEEDBACK_DISPLAY_MS = 3_000;
const RESEND_COOLDOWN_S = 60;

const authColors = {
  text: "#e8e6e1",
  textMuted: "rgba(255,255,255,0.55)",
  input: "rgba(255,255,255,0.08)",
  primary: GOLD,
  danger: "#ef4444",
  border: "rgba(255,255,255,0.12)",
  success: "#22c55e",
  sidebarText: BG,
  card: BG,
  background: "#ffffff",
};

export default function VerifyOtp() {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();
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

  // L'OTP est déjà envoyé par /auth/login ou /auth/register.
  // Ne pas rappeler sendOtpEmail ici pour éviter un double envoi
  // qui écraserait le code en base et invaliderait le premier.

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
      style={{ flex: 1, backgroundColor: "#ffffff" }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: isMobile ? 16 : 24 }}>
        <View style={{ width: "100%", maxWidth: isMobile ? undefined : 440, backgroundColor: BG, padding: isMobile ? 20 : 32, borderRadius: 16 }}>
          <AuthLogo />

          <Text style={{ fontFamily: fonts.heading, fontWeight: fontWeights.heading, fontSize: 26, color: "#e8e6e1", marginBottom: 4 }}>
            {t("auth.verification")}
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 16, color: "rgba(255,255,255,0.55)", marginBottom: 24 }}>
            {t("auth.enterCodeSentTo", { email })}
          </Text>

          {/* Dev code - visible uniquement en mode développement */}
          {__DEV__ && devCode ? (
            <View style={{ borderWidth: 1, borderStyle: "dashed", borderColor: "#22c55e", backgroundColor: "#22c55e" + "15", padding: 16, marginBottom: 16, alignItems: "center" }}>
              <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 14, color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>{t("auth.codeDev")}</Text>
              <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 32, color: "#22c55e", letterSpacing: 4 }}>
                {devCode}
              </Text>
            </View>
          ) : null}

          {/* Messages */}
          {error ? (
            <View style={{ backgroundColor: "rgba(239,68,68,0.08)", padding: 12, marginBottom: 16, borderRadius: 8 }}>
              <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, color: "#ef4444", fontSize: 16 }}>{error}</Text>
            </View>
          ) : null}
          {success ? (
            <View style={{ backgroundColor: "#22c55e" + "15", padding: 12, marginBottom: 16, borderRadius: 8 }}>
              <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, color: "#22c55e", fontSize: 16 }}>{success}</Text>
            </View>
          ) : null}

          {/* Code input */}
          <OtpInput
            code={code}
            cooldown={cooldown}
            onChangeCode={(cleaned) => { setCode(cleaned); setError(""); }}
            onResend={handleResend}
            onSubmit={handleVerify}
            colors={authColors}
          />

          {/* Bouton */}
          <TouchableOpacity
            style={{ width: "100%", backgroundColor: GOLD, padding: 16, alignItems: "center", borderRadius: 10, opacity: loading || code.length !== 6 ? 0.7 : 1 }}
            onPress={handleVerify}
            activeOpacity={0.8}
            disabled={loading || code.length !== 6}
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

          {/* Renvoyer le code */}
          <TouchableOpacity style={{ alignItems: "center", marginTop: 20 }} onPress={handleResend} disabled={cooldown > 0} accessibilityLabel={t("auth.resendCode")} accessibilityRole="button">
            <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 16, color: cooldown > 0 ? "rgba(255,255,255,0.55)" : GOLD, textDecorationLine: cooldown > 0 ? "none" : "underline" }}>
              {cooldown > 0 ? t("auth.resendCooldown", { seconds: cooldown }) : t("auth.resendCode")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
