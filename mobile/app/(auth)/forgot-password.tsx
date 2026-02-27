import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";
import { authApi } from "@/lib/api/auth";
import axios from "axios";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [emailLocal, setEmailLocal] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setEmail = useAuthStore((s) => s.setEmail);
  const setDevCode = useAuthStore((s) => s.setDevCode);

  const handleSendCode = async () => {
    if (!emailLocal.trim()) {
      setError(t("auth.emailRequired"));
      return;
    }
    setError("");
    setLoading(true);

    try {
      const data = await authApi.forgotPassword({ email: emailLocal.trim() });
      setEmail(emailLocal.trim());
      if (__DEV__ && data.devCode) setDevCode(data.devCode);
      router.push("/(auth)/reset-password");
    } catch (err) {
      setError((axios.isAxiosError(err) && err.response?.data?.error) || t("auth.sendError"));
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
            {t("auth.forgotPassword")}
          </Text>
          <Text className="text-sm text-muted mb-6">
            {t("auth.enterEmailReset")}
          </Text>

          {/* Erreur */}
          {error ? (
            <View className="bg-red-50 p-3 mb-4">
              <Text className="text-danger text-sm">{error}</Text>
            </View>
          ) : null}

          {/* Email */}
          <Text className="text-sm font-semibold text-text mb-2">
            Email <Text className="text-danger">*</Text>
          </Text>
          <TextInput
            className="w-full bg-input  p-3 text-base text-text mb-4 border-0"
            placeholder={t("auth.emailPlaceholder")}
            placeholderTextColor="#888"
            value={emailLocal}
            onChangeText={(text) => {
              setEmailLocal(text);
              setError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleSendCode}
          />

          {/* Bouton */}
          <TouchableOpacity
            className="w-full bg-primary p-4 items-center"
            onPress={handleSendCode}
            activeOpacity={0.8}
            disabled={loading}
            style={loading ? { opacity: 0.7 } : undefined}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                {t("auth.sendCode")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Retour */}
          <TouchableOpacity className="items-center mt-4" onPress={() => router.replace("/(auth)")}>
            <Text className="text-sm text-primary underline">
              {t("auth.backToLogin")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
