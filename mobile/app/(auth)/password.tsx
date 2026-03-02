import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";
import { useTheme } from "@/lib/theme/ThemeContext";
import { authApi } from "@/lib/api/auth";
import axios from "axios";

export default function LoginPassword() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const email = useAuthStore((s) => s.email);
  const setDevCode = useAuthStore((s) => s.setDevCode);
  const setUser = useAuthStore((s) => s.setUser);
  const setOtpSource = useAuthStore((s) => s.setOtpSource);

  const handleLogin = async () => {
    if (!password) {
      setError(t("auth.passwordRequired"));
      return;
    }
    setError("");
    setLoading(true);

    try {
      const data = await authApi.login({ email, password });
      setUser(data.user ?? null);
      if (data.otpCode) {
        setDevCode(data.otpCode);
      }
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
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }}>
        <View style={{ width: "100%", maxWidth: 420, backgroundColor: colors.card, padding: 32 }}>
          {/* Bouton retour */}
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/")}
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
          >
            <Ionicons name="arrow-back" size={22} color={colors.primary} />
            <Text style={{ color: colors.primary, fontSize: 15, fontWeight: "600", marginLeft: 6 }}>
              {t("common.back") || "Retour"}
            </Text>
          </TouchableOpacity>

          {/* Logo */}
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <Text style={{ fontSize: 36, fontWeight: "700", color: colors.primary }}>CGI242</Text>
            <Text style={{ fontSize: 14, color: colors.textMuted, marginTop: 4 }}>
              Intelligence Fiscale IA
            </Text>
          </View>

          <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text, marginBottom: 4 }}>
            {t("auth.password")}
          </Text>

          {/* Email affiché */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
            <Text style={{ fontSize: 14, color: colors.textMuted, flex: 1 }}>{email}</Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/")}>
              <Text style={{ fontSize: 14, color: colors.primary, fontWeight: "600" }}>
                {t("common.modify")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Erreur */}
          {error ? (
            <View style={{ backgroundColor: colors.danger + "15", padding: 12, marginBottom: 16 }}>
              <Text style={{ color: colors.danger, fontSize: 14 }}>{error}</Text>
            </View>
          ) : null}

          {/* Password */}
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
            {t("auth.password")} <Text style={{ color: colors.danger }}>*</Text>
          </Text>
          <View style={{ marginBottom: 8 }}>
            <TextInput
              style={{ width: "100%", backgroundColor: colors.input, padding: 12, paddingRight: 48, fontSize: 16, color: colors.text }}
              placeholder={t("auth.yourPassword")}
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError("");
              }}
              secureTextEntry={!showPassword}
              autoComplete="password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
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

          {/* Mot de passe oublié */}
          <TouchableOpacity
            style={{ alignSelf: "flex-end", marginBottom: 16 }}
            onPress={() => router.push("/(auth)/forgot-password")}
          >
            <Text style={{ fontSize: 14, color: colors.primary }}>
              {t("auth.forgotPassword")}
            </Text>
          </TouchableOpacity>

          {/* Bouton */}
          <TouchableOpacity
            style={{ width: "100%", backgroundColor: colors.primary, padding: 16, alignItems: "center", opacity: loading ? 0.7 : 1 }}
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
                {t("auth.signIn")}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
