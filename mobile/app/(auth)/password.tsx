import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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

export default function LoginPassword() {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const [rememberMe, setRememberMe] = useState(false);

  const email = useAuthStore((s) => s.email);
  const setDevCode = useAuthStore((s) => s.setDevCode);
  const setUser = useAuthStore((s) => s.setUser);
  const setOtpSource = useAuthStore((s) => s.setOtpSource);
  const setStoreRememberMe = useAuthStore((s) => s.setRememberMe);

  const handleLogin = async () => {
    if (!password) {
      setError(t("auth.passwordRequired"));
      return;
    }
    setError("");
    setLoading(true);

    try {
      const data = await authApi.login({ email, password, rememberMe, turnstileToken: turnstileToken ?? undefined });
      setUser(data.user ?? null);
      if (data.otpCode) {
        setDevCode(data.otpCode);
      }
      setStoreRememberMe(rememberMe);
      setOtpSource("login");
      router.push("/(auth)/verify-otp");
    } catch (err) {
      setError(
        (axios.isAxiosError(err) && err.response?.data?.error) || t("auth.invalidCredentials")
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
        <View style={{ width: "100%", maxWidth: isMobile ? undefined : 440, backgroundColor: BG, padding: isMobile ? 24 : 40, borderRadius: 16 }}>
          {/* Bouton retour */}
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/")}
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
            accessibilityLabel={t("common.back")}
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={22} color={GOLD} />
            <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, color: GOLD, fontSize: 17, marginLeft: 6 }}>
              {t("common.back") || "Retour"}
            </Text>
          </TouchableOpacity>

          <AuthLogo />

          <Text style={{ fontFamily: fonts.heading, fontWeight: fontWeights.heading, fontSize: 26, color: "#e8e6e1", marginBottom: 4 }}>
            {t("auth.password")}
          </Text>

          {/* Email affiché */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
            <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 16, color: "rgba(255,255,255,0.55)", flex: 1 }}>{email}</Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/")} accessibilityLabel={t("common.modify")} accessibilityRole="link">
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 16, color: GOLD }}>
                {t("common.modify")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Erreur */}
          {error ? (
            <View style={{ backgroundColor: "rgba(239,68,68,0.08)", padding: 12, marginBottom: 16, borderRadius: 8 }}>
              <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, color: "#ef4444", fontSize: 16 }}>{error}</Text>
            </View>
          ) : null}

          {/* Password */}
          <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 16, color: "#e8e6e1", marginBottom: 10 }}>
            {t("auth.password")} <Text style={{ color: "#f87171" }}>*</Text>
          </Text>
          <View style={{ marginBottom: 8 }}>
            <TextInput
              style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, width: "100%", backgroundColor: "rgba(255,255,255,0.08)", padding: 14, paddingRight: 48, fontSize: 18, color: "#e8e6e1", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 8 }}
              placeholder={t("auth.yourPassword")}
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError("");
              }}
              secureTextEntry={!showPassword}
              autoComplete="password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              accessibilityLabel={t("auth.yourPassword")}
            />
            <TouchableOpacity
              style={{ position: "absolute", right: 12, top: 14 }}
              onPress={() => setShowPassword(!showPassword)}
              accessibilityLabel={t("auth.togglePassword")}
              accessibilityRole="button"
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="rgba(255,255,255,0.5)"
              />
            </TouchableOpacity>
          </View>

          {/* Mot de passe oublié */}
          <TouchableOpacity
            style={{ alignSelf: "flex-end", marginBottom: 12 }}
            onPress={() => router.push("/(auth)/forgot-password")}
            accessibilityLabel={t("auth.forgotPassword")}
            accessibilityRole="link"
          >
            <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 16, color: GOLD }}>
              {t("auth.forgotPassword")}
            </Text>
          </TouchableOpacity>

          {/* Se souvenir de moi */}
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.7}
            accessibilityLabel={t("auth.rememberMe")}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: rememberMe }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderWidth: 2,
                borderColor: rememberMe ? GOLD : "rgba(255,255,255,0.4)",
                backgroundColor: rememberMe ? GOLD : "transparent",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
                borderRadius: 4,
              }}
            >
              {rememberMe ? (
                <Ionicons name="checkmark" size={14} color={BG} />
              ) : null}
            </View>
            <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 16, color: "#e8e6e1" }}>
              {t("auth.rememberMe")}
            </Text>
          </TouchableOpacity>

          <TurnstileWidget onToken={setTurnstileToken} />

          {/* Bouton */}
          <TouchableOpacity
            style={{ width: "100%", backgroundColor: GOLD, padding: 16, alignItems: "center", borderRadius: 10, marginTop: 4, opacity: loading ? 0.7 : 1 }}
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={loading}
            accessibilityLabel={t("auth.signIn")}
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator color={BG} />
            ) : (
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, color: BG, fontSize: 18 }}>
                {t("auth.signIn")}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
