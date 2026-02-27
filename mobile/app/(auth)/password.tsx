import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";
import { authApi } from "@/lib/api/auth";
import axios from "axios";

export default function LoginPassword() {
  const { t } = useTranslation();
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
            {t("auth.password")}
          </Text>

          {/* Email affiché */}
          <View className="flex-row items-center mb-6">
            <Text className="text-sm text-muted flex-1">{email}</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-sm text-primary font-semibold">
                {t("common.modify")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Erreur */}
          {error ? (
            <View className="bg-red-50 p-3 mb-4">
              <Text className="text-danger text-sm">{error}</Text>
            </View>
          ) : null}

          {/* Password */}
          <Text className="text-sm font-semibold text-text mb-2">
            {t("auth.password")} <Text className="text-danger">*</Text>
          </Text>
          <View className="relative mb-2">
            <TextInput
              className="w-full bg-input  p-3 pr-12 text-base text-text border-0"
              placeholder={t("auth.yourPassword")}
              placeholderTextColor="#888"
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

          {/* Mot de passe oublié */}
          <TouchableOpacity
            className="self-end mb-4"
            onPress={() => router.push("/(auth)/forgot-password")}
          >
            <Text className="text-sm text-primary">
              {t("auth.forgotPassword")}
            </Text>
          </TouchableOpacity>

          {/* Bouton */}
          <TouchableOpacity
            className="w-full bg-primary p-4 items-center"
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={loading}
            style={loading ? { opacity: 0.7 } : undefined}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                {t("auth.signIn")}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
