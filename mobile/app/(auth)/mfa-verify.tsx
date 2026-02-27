import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useAuthStore } from "@/lib/store/auth";
import { api } from "@/lib/api/client";
import axios from "axios";

export default function MfaVerify() {
  const { mfaToken } = useLocalSearchParams<{ mfaToken: string }>();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((s) => s.login);

  const handleVerify = async () => {
    if (code.length < 6) {
      setError("Entrez votre code à 6 chiffres");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/mfa/verify", { mfaToken, code });
      if (data.user) {
        await login(data.user, data.token, data.refreshToken);
      }
      router.replace("/(app)");
    } catch (err) {
      setError(
        (axios.isAxiosError(err) && err.response?.data?.error) || "Code MFA invalide"
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
            Authentification 2FA
          </Text>
          <Text className="text-sm text-muted mb-6">
            Entrez le code depuis votre application d'authentification (Google Authenticator, Authy, etc.) ou un code de secours.
          </Text>

          {/* Messages */}
          {error ? (
            <View className="bg-red-50 p-3 mb-4">
              <Text className="text-danger text-sm">{error}</Text>
            </View>
          ) : null}

          {/* Code input */}
          <Text className="text-sm font-semibold text-text mb-2">
            Code TOTP ou code de secours
          </Text>
          <TextInput
            className="w-full bg-input p-3 text-center text-2xl tracking-widest text-text mb-4 border-0"
            placeholder="000000"
            placeholderTextColor="#888"
            value={code}
            onChangeText={(text) => {
              setCode(text.replace(/[^0-9A-Za-z\-]/g, "").slice(0, 9));
              setError("");
            }}
            keyboardType="default"
            maxLength={9}
            autoCapitalize="characters"
            returnKeyType="done"
            onSubmitEditing={handleVerify}
          />

          {/* Bouton */}
          <TouchableOpacity
            className="w-full bg-primary p-4 items-center"
            onPress={handleVerify}
            activeOpacity={0.8}
            disabled={loading || code.length < 6}
            style={loading || code.length < 6 ? { opacity: 0.7 } : undefined}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Vérifier
              </Text>
            )}
          </TouchableOpacity>

          {/* Retour */}
          <TouchableOpacity
            className="items-center mt-4"
            onPress={() => router.replace("/(auth)/password")}
          >
            <Text className="text-sm text-primary underline">
              Retour à la connexion
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
