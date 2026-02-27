import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";
import { useTheme } from "@/lib/theme/ThemeContext";
import { authApi } from "@/lib/api/auth";
import axios from "axios";

export default function Register() {
  const { t } = useTranslation();
  const { colors } = useTheme();
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
  const [emailError, setEmailError] = useState("");
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [loading, setLoading] = useState(false);

  const setEmail = useAuthStore((s) => s.setEmail);
  const setOtpCode = useAuthStore((s) => s.setOtpCode);
  const setDevCode = useAuthStore((s) => s.setDevCode);
  const setUser = useAuthStore((s) => s.setUser);
  const setOtpSource = useAuthStore((s) => s.setOtpSource);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
    if (key === "email") {
      setEmailError("");
      setEmailExists(false);
    }
  };

  const handleEmailBlur = async () => {
    const email = form.email.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return;
    setEmailChecking(true);
    try {
      const result = await authApi.checkEmail(email);
      if (result.exists) {
        setEmailExists(true);
        setEmailError(t("auth.emailAlreadyExists"));
      }
    } catch {
      // Ignore network errors — server-side check is best-effort
    } finally {
      setEmailChecking(false);
    }
  };

  const handleRegister = async () => {
    if (emailExists) {
      setError(t("auth.emailAlreadyExists"));
      return;
    }
    if (!form.entrepriseNom.trim() || !form.nom.trim() || !form.prenom.trim() || !form.email.trim() || !form.password) {
      setError(t("auth.requiredFields"));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) {
      setError(t("auth.emailInvalid"));
      return;
    }
    if (form.password.length < 12) {
      setError(t("auth.passwordMinLength"));
      return;
    }
    if (!/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      setError(t("auth.passwordComplexity"));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(t("auth.passwordMismatch"));
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
      setError((axios.isAxiosError(err) && err.response?.data?.error) || t("auth.registerError"));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%" as const,
    backgroundColor: colors.input,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <View style={{ width: "100%", maxWidth: 520, backgroundColor: colors.card, padding: 32 }}>
          {/* Logo */}
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <Text style={{ fontSize: 36, fontWeight: "700", color: colors.primary }}>CGI242</Text>
            <Text style={{ fontSize: 14, color: colors.textMuted, marginTop: 4 }}>
              Intelligence Fiscale IA
            </Text>
          </View>

          <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text, marginBottom: 4 }}>
            {t("auth.createCompany")}
          </Text>
          <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 24 }}>
            {t("auth.companyAdmin")}
          </Text>

          {/* Erreur */}
          {error ? (
            <View style={{ backgroundColor: colors.danger + "15", padding: 12, marginBottom: 16 }}>
              <Text style={{ color: colors.danger, fontSize: 14 }}>{error}</Text>
            </View>
          ) : null}

          {/* Nom du cabinet */}
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
            {t("auth.company")} <Text style={{ color: colors.danger }}>*</Text>
          </Text>
          <TextInput
            style={{ ...inputStyle, marginBottom: 16 }}
            placeholder={t("auth.companyPlaceholder")}
            placeholderTextColor={colors.textMuted}
            value={form.entrepriseNom}
            onChangeText={(v) => updateField("entrepriseNom", v)}
          />

          {/* Nom + Prénom */}
          <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
                {t("auth.lastName")} <Text style={{ color: colors.danger }}>*</Text>
              </Text>
              <TextInput
                style={inputStyle}
                placeholder={t("auth.lastName")}
                placeholderTextColor={colors.textMuted}
                value={form.nom}
                onChangeText={(v) => updateField("nom", v)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
                {t("auth.firstName")} <Text style={{ color: colors.danger }}>*</Text>
              </Text>
              <TextInput
                style={inputStyle}
                placeholder={t("auth.firstName")}
                placeholderTextColor={colors.textMuted}
                value={form.prenom}
                onChangeText={(v) => updateField("prenom", v)}
              />
            </View>
          </View>

          {/* Email */}
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
            Email <Text style={{ color: colors.danger }}>*</Text>
          </Text>
          <TextInput
            style={{ ...inputStyle, marginBottom: emailError ? 4 : 16, borderWidth: emailError ? 1 : 0, borderColor: emailError ? colors.danger : "transparent" }}
            placeholder={t("auth.emailPlaceholder")}
            placeholderTextColor={colors.textMuted}
            value={form.email}
            onChangeText={(v) => updateField("email", v)}
            onBlur={handleEmailBlur}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? (
            <Text style={{ color: colors.danger, fontSize: 12, marginBottom: 12 }}>{emailError}</Text>
          ) : null}

          {/* Téléphone */}
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
            {t("auth.phone")}
          </Text>
          <TextInput
            style={{ ...inputStyle, marginBottom: 16 }}
            placeholder={t("auth.phonePlaceholder")}
            placeholderTextColor={colors.textMuted}
            value={form.telephone}
            onChangeText={(v) => updateField("telephone", v.replace(/[^\d\s+()-]/g, ""))}
            keyboardType="phone-pad"
          />

          {/* Mots de passe */}
          <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
                {t("auth.password")} <Text style={{ color: colors.danger }}>*</Text>
              </Text>
              <View>
                <TextInput
                  style={{ ...inputStyle, paddingRight: 48 }}
                  placeholder={t("auth.passwordPlaceholder")}
                  placeholderTextColor={colors.textMuted}
                  value={form.password}
                  onChangeText={(v) => updateField("password", v)}
                  secureTextEntry={!showPassword}
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
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
                {t("common.confirm")} <Text style={{ color: colors.danger }}>*</Text>
              </Text>
              <TextInput
                style={inputStyle}
                placeholder={t("common.confirm")}
                placeholderTextColor={colors.textMuted}
                value={form.confirmPassword}
                onChangeText={(v) => updateField("confirmPassword", v)}
                secureTextEntry={!showPassword}
              />
            </View>
          </View>

          {/* Bouton */}
          <TouchableOpacity
            style={{ width: "100%", backgroundColor: colors.primary, padding: 16, alignItems: "center", marginTop: 8, opacity: loading ? 0.7 : 1 }}
            onPress={handleRegister}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
                {t("auth.createAccount")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Lien connexion */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 24 }}>
            <Text style={{ fontSize: 14, color: colors.textMuted }}>{t("auth.alreadyHaveAccount")} </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ fontSize: 14, color: colors.primary, fontWeight: "600", textDecorationLine: "underline" }}>
                {t("auth.signIn")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
