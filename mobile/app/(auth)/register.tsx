import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useResponsive } from "@/lib/hooks/useResponsive";
import { authApi } from "@/lib/api/auth";
import axios from "axios";
import EmailField from "@/components/auth/EmailField";
import PasswordFields from "@/components/auth/PasswordFields";

export default function Register() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isMobile } = useResponsive();
  const { invitation } = useLocalSearchParams<{ invitation?: string }>();
  const hasInvitation = !!invitation;
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
    if ((!hasInvitation && !form.entrepriseNom.trim()) || !form.nom.trim() || !form.prenom.trim() || !form.email.trim() || !form.password) {
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
        entrepriseNom: hasInvitation ? undefined : form.entrepriseNom.trim(),
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        email: form.email.trim(),
        telephone: form.telephone.trim() || undefined,
        password: form.password,
        invitationToken: invitation || undefined,
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
    padding: isMobile ? 10 : 12,
    fontSize: isMobile ? 15 : 16,
    color: colors.text,
    borderRadius: 8,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: isMobile ? 12 : 24, paddingVertical: isMobile ? 16 : 24 }}>
        <View style={{ width: "100%", maxWidth: isMobile ? undefined : 520, backgroundColor: colors.card, padding: isMobile ? 16 : 32, borderRadius: isMobile ? 12 : 16 }}>
          {/* Logo */}
          <View style={{ alignItems: "center", marginBottom: isMobile ? 16 : 24 }}>
            <Text style={{ fontSize: isMobile ? 28 : 36, fontWeight: "700", color: colors.primary }}>CGI242</Text>
            <Text style={{ fontSize: isMobile ? 12 : 14, color: colors.textMuted, marginTop: 4 }}>
              Intelligence Fiscale IA
            </Text>
          </View>

          <Text style={{ fontSize: isMobile ? 20 : 24, fontWeight: "700", color: colors.text, marginBottom: 4 }}>
            {hasInvitation ? t("auth.joinTeam") : t("auth.createCompany")}
          </Text>
          <Text style={{ fontSize: isMobile ? 13 : 14, color: colors.textMuted, marginBottom: isMobile ? 16 : 24 }}>
            {hasInvitation ? t("auth.invitedDescription") : t("auth.companyAdmin")}
          </Text>

          {/* Bannière invitation */}
          {hasInvitation && (
            <View style={{ backgroundColor: "#00815d15", borderLeftWidth: 4, borderLeftColor: "#00815d", padding: isMobile ? 10 : 12, marginBottom: isMobile ? 12 : 16, borderRadius: 8 }}>
              <Text style={{ color: "#00815d", fontSize: isMobile ? 13 : 14, fontWeight: "600" }}>
                {t("auth.invitedBanner")}
              </Text>
            </View>
          )}

          {/* Erreur */}
          {error ? (
            <View style={{ backgroundColor: colors.danger + "15", padding: isMobile ? 10 : 12, marginBottom: isMobile ? 12 : 16, borderRadius: 8 }}>
              <Text style={{ color: colors.danger, fontSize: isMobile ? 13 : 14 }}>{error}</Text>
            </View>
          ) : null}

          {/* Nom du cabinet (masqué si invitation) */}
          {!hasInvitation && (
            <>
              <Text style={{ fontSize: isMobile ? 13 : 14, fontWeight: "600", color: colors.text, marginBottom: isMobile ? 6 : 8 }}>
                {t("auth.company")} <Text style={{ color: colors.danger }}>*</Text>
              </Text>
              <TextInput
                style={{ ...inputStyle, marginBottom: isMobile ? 12 : 16 }}
                placeholder={t("auth.companyPlaceholder")}
                placeholderTextColor={colors.textMuted}
                value={form.entrepriseNom}
                onChangeText={(v) => updateField("entrepriseNom", v)}
              />
            </>
          )}

          {/* Nom + Prénom */}
          <View style={{ flexDirection: isMobile ? "column" : "row", gap: isMobile ? 10 : 16, marginBottom: isMobile ? 12 : 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: isMobile ? 13 : 14, fontWeight: "600", color: colors.text, marginBottom: isMobile ? 6 : 8 }}>
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
              <Text style={{ fontSize: isMobile ? 13 : 14, fontWeight: "600", color: colors.text, marginBottom: isMobile ? 6 : 8 }}>
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
          <EmailField
            email={form.email}
            emailError={emailError}
            emailChecking={emailChecking}
            onChangeEmail={(v) => updateField("email", v)}
            onBlur={handleEmailBlur}
            colors={colors}
          />

          {/* Téléphone */}
          <Text style={{ fontSize: isMobile ? 13 : 14, fontWeight: "600", color: colors.text, marginBottom: isMobile ? 6 : 8 }}>
            {t("auth.phone")}
          </Text>
          <TextInput
            style={{ ...inputStyle, marginBottom: isMobile ? 12 : 16 }}
            placeholder={t("auth.phonePlaceholder")}
            placeholderTextColor={colors.textMuted}
            value={form.telephone}
            onChangeText={(v) => updateField("telephone", v.replace(/[^\d\s+()-]/g, ""))}
            keyboardType="phone-pad"
          />

          {/* Mots de passe */}
          <PasswordFields
            password={form.password}
            confirmPassword={form.confirmPassword}
            showPassword={showPassword}
            onChangePassword={(v) => updateField("password", v)}
            onChangeConfirmPassword={(v) => updateField("confirmPassword", v)}
            onToggleShowPassword={() => setShowPassword(!showPassword)}
            colors={colors}
          />

          {/* Bouton */}
          <TouchableOpacity
            style={{ width: "100%", backgroundColor: colors.primary, padding: isMobile ? 14 : 16, alignItems: "center", marginTop: isMobile ? 4 : 8, borderRadius: 8, opacity: loading ? 0.7 : 1 }}
            onPress={handleRegister}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: isMobile ? 15 : 16 }}>
                {t("auth.createAccount")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Lien connexion */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: isMobile ? 16 : 24 }}>
            <Text style={{ fontSize: isMobile ? 13 : 14, color: colors.textMuted }}>{t("auth.alreadyHaveAccount")} </Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/")}>
              <Text style={{ fontSize: isMobile ? 13 : 14, color: colors.primary, fontWeight: "600", textDecorationLine: "underline" }}>
                {t("auth.signIn")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
