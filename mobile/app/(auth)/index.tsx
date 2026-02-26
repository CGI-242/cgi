import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Linking } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useAuthStore } from "@/lib/store/auth";

const LEGAL_URLS = {
  aide: "https://cgi242.normx.ai/aide",
  confidentialite: "https://cgi242.normx.ai/confidentialite",
  conditions: "https://cgi242.normx.ai/conditions",
};

export default function LoginEmail() {
  const [email, setEmailLocal] = useState("");
  const [error, setError] = useState("");
  const setEmail = useAuthStore((s) => s.setEmail);

  const handleContinue = () => {
    if (!email.trim()) {
      setError("Veuillez saisir votre email");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email invalide");
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
          <Text className="text-2xl font-bold text-text mb-1">Connexion</Text>
          <Text className="text-sm text-muted mb-6">
            Entrez votre email pour continuer
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
            placeholder="votre@email.com"
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
              Continuer
            </Text>
          </TouchableOpacity>

          {/* Lien inscription */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-sm text-muted">Pas encore de compte ? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text className="text-sm text-primary font-semibold underline">
                Créer une entreprise
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View className="flex-row gap-8 mt-6">
          <TouchableOpacity onPress={() => Linking.openURL(LEGAL_URLS.aide)}>
            <Text className="text-xs text-muted underline">Aide</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(LEGAL_URLS.confidentialite)}>
            <Text className="text-xs text-muted underline">Confidentialite</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(LEGAL_URLS.conditions)}>
            <Text className="text-xs text-muted underline">Conditions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
