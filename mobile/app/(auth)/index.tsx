import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Linking } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";

const LEGAL_URLS = {
  aide: "https://cgi242.normx.ai/aide",
  confidentialite: "https://cgi242.normx.ai/confidentialite",
  conditions: "https://cgi242.normx.ai/conditions",
};

export default function LoginEmail() {
  const { t } = useTranslation();
  const [email, setEmailLocal] = useState("");
  const [error, setError] = useState("");
  const setEmail = useAuthStore((s) => s.setEmail);

  const handleContinue = () => {
    if (!email.trim()) {
      setError(t("auth.emailRequired"));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError(t("auth.emailInvalid"));
      return;
    }
    setError("");
    setEmail(email.trim());
    router.push("/(auth)/password");
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

          {/* Titre */}
          <Text className="text-2xl font-bold text-text mb-1">{t("auth.login")}</Text>
          <Text className="text-sm text-muted mb-6">
            {t("auth.enterEmail")}
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
            value={email}
            onChangeText={(text) => {
              setEmailLocal(text);
              setError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
            onSubmitEditing={handleContinue}
          />

          {/* Bouton */}
          <TouchableOpacity
            className="w-full bg-primary p-4 items-center mt-2"
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">
              {t("auth.continue")}
            </Text>
          </TouchableOpacity>

          {/* Lien inscription */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-sm text-muted">{t("auth.noAccount")} </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text className="text-sm text-primary font-semibold underline">
                {t("auth.createCompany")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View className="flex-row gap-8 mt-6">
          <TouchableOpacity onPress={() => Linking.openURL(LEGAL_URLS.aide)}>
            <Text className="text-xs text-muted underline">{t("auth.help")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(LEGAL_URLS.confidentialite)}>
            <Text className="text-xs text-muted underline">{t("auth.privacy")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(LEGAL_URLS.conditions)}>
            <Text className="text-xs text-muted underline">{t("auth.terms")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
