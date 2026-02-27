import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/lib/store/auth";
import { authApi } from "@/lib/api/auth";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    entrepriseNom: "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setEmail = useAuthStore((s) => s.setEmail);
  const setOtpCode = useAuthStore((s) => s.setOtpCode);
  const setDevCode = useAuthStore((s) => s.setDevCode);
  const setUser = useAuthStore((s) => s.setUser);
  const setOtpSource = useAuthStore((s) => s.setOtpSource);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const handleRegister = async () => {
    if (!form.entrepriseNom.trim() || !form.nom.trim() || !form.prenom.trim() || !form.email.trim() || !form.password) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }
    if (form.password.length < 12) {
      setError("Le mot de passe doit contenir au moins 12 caractères");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const data = await authApi.register({
        entrepriseNom: form.entrepriseNom.trim(),
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        email: form.email.trim(),
        telephone: form.telephone.trim() || undefined,
        password: form.password,
      });
      setUser(data.user ?? null);
      setEmail(form.email.trim());
      if (data.otpCode) {
        setOtpCode(data.otpCode);
        setDevCode(data.otpCode);
      }
      setOtpSource("register");
      router.push("/(auth)/verify-otp");
    } catch (err) {
      setError((axios.isAxiosError(err) && err.response?.data?.error) || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <View className="w-full max-w-[520px] bg-card p-8">
          {/* Logo */}
          <View className="items-center mb-6">
            <Text className="text-4xl font-bold text-primary">CGI242</Text>
            <Text className="text-sm text-muted mt-1">
              Intelligence Fiscale IA
            </Text>
          </View>

          <Text className="text-2xl font-bold text-text mb-1">
            Créer une entreprise
          </Text>
          <Text className="text-sm text-muted mb-6">
            Vous serez l'administrateur de cette entreprise
          </Text>

          {/* Erreur */}
          {error ? (
            <View className="bg-red-50 p-3 mb-4">
              <Text className="text-danger text-sm">{error}</Text>
            </View>
          ) : null}

          {/* Nom du cabinet */}
          <Text className="text-sm font-semibold text-text mb-2">
            Nom de l'entreprise <Text className="text-danger">*</Text>
          </Text>
          <TextInput
            className="w-full bg-input  p-3 text-base text-text mb-4 border-0"
            placeholder="Ex: Entreprise Fiscale Brazzaville"
            placeholderTextColor="#888"
            value={form.entrepriseNom}
            onChangeText={(v) => updateField("entrepriseNom", v)}
          />

          {/* Nom + Prénom */}
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-text mb-2">
                Nom <Text className="text-danger">*</Text>
              </Text>
              <TextInput
                className="w-full bg-input  p-3 text-base text-text border-0"
                placeholder="Nom"
                placeholderTextColor="#888"
                value={form.nom}
                onChangeText={(v) => updateField("nom", v)}
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-text mb-2">
                Prénom <Text className="text-danger">*</Text>
              </Text>
              <TextInput
                className="w-full bg-input  p-3 text-base text-text border-0"
                placeholder="Prénom"
                placeholderTextColor="#888"
                value={form.prenom}
                onChangeText={(v) => updateField("prenom", v)}
              />
            </View>
          </View>

          {/* Email */}
          <Text className="text-sm font-semibold text-text mb-2">
            Email <Text className="text-danger">*</Text>
          </Text>
          <TextInput
            className="w-full bg-input  p-3 text-base text-text mb-4 border-0"
            placeholder="votre@email.com"
            placeholderTextColor="#888"
            value={form.email}
            onChangeText={(v) => updateField("email", v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Téléphone */}
          <Text className="text-sm font-semibold text-text mb-2">
            Téléphone
          </Text>
          <TextInput
            className="w-full bg-input  p-3 text-base text-text mb-4 border-0"
            placeholder="+242 06 XXX XX XX"
            placeholderTextColor="#888"
            value={form.telephone}
            onChangeText={(v) => updateField("telephone", v)}
            keyboardType="phone-pad"
          />

          {/* Mots de passe */}
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-text mb-2">
                Mot de passe <Text className="text-danger">*</Text>
              </Text>
              <View className="relative">
                <TextInput
                  className="w-full bg-input  p-3 pr-12 text-base text-text border-0"
                  placeholder="Min. 12 caractères"
                  placeholderTextColor="#888"
                  value={form.password}
                  onChangeText={(v) => updateField("password", v)}
                  secureTextEntry={!showPassword}
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
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-text mb-2">
                Confirmer <Text className="text-danger">*</Text>
              </Text>
              <TextInput
                className="w-full bg-input  p-3 text-base text-text border-0"
                placeholder="Confirmer"
                placeholderTextColor="#888"
                value={form.confirmPassword}
                onChangeText={(v) => updateField("confirmPassword", v)}
                secureTextEntry={!showPassword}
              />
            </View>
          </View>

          {/* Bouton */}
          <TouchableOpacity
            className="w-full bg-primary p-4 items-center mt-2"
            onPress={handleRegister}
            activeOpacity={0.8}
            disabled={loading}
            style={loading ? { opacity: 0.7 } : undefined}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Créer mon entreprise
              </Text>
            )}
          </TouchableOpacity>

          {/* Lien connexion */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-sm text-muted">Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-sm text-primary font-semibold underline">
                Se connecter
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
