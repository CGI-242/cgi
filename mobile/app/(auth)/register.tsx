import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Modal, FlatList } from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/lib/store/auth";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useResponsive } from "@/lib/hooks/useResponsive";
import { authApi } from "@/lib/api/auth";
import axios from "axios";
import EmailField from "@/components/auth/EmailField";
import PasswordFields from "@/components/auth/PasswordFields";
import { fonts, fontWeights } from "@/lib/theme/fonts";
import AuthLogo from "@/components/auth/AuthLogo";

const COUNTRIES = [
  { code: "242", name: "Congo-Brazzaville", flag: "\u{1F1E8}\u{1F1EC}", available: true },
  { code: "243", name: "R.D. Congo", flag: "\u{1F1E8}\u{1F1E9}", available: false },
  { code: "237", name: "Cameroun", flag: "\u{1F1E8}\u{1F1F2}", available: false },
  { code: "241", name: "Gabon", flag: "\u{1F1EC}\u{1F1E6}", available: false },
  { code: "235", name: "Tchad", flag: "\u{1F1F9}\u{1F1E9}", available: false },
  { code: "236", name: "Centrafrique", flag: "\u{1F1E8}\u{1F1EB}", available: false },
  { code: "240", name: "Guin\u00e9e \u00c9q.", flag: "\u{1F1EC}\u{1F1F6}", available: false },
  { code: "221", name: "S\u00e9n\u00e9gal", flag: "\u{1F1F8}\u{1F1F3}", available: false },
  { code: "225", name: "C\u00f4te d'Ivoire", flag: "\u{1F1E8}\u{1F1EE}", available: false },
  { code: "223", name: "Mali", flag: "\u{1F1F2}\u{1F1F1}", available: false },
  { code: "226", name: "Burkina Faso", flag: "\u{1F1E7}\u{1F1EB}", available: false },
  { code: "229", name: "B\u00e9nin", flag: "\u{1F1E7}\u{1F1EF}", available: false },
  { code: "228", name: "Togo", flag: "\u{1F1F9}\u{1F1EC}", available: false },
  { code: "227", name: "Niger", flag: "\u{1F1F3}\u{1F1EA}", available: false },
  { code: "224", name: "Guin\u00e9e", flag: "\u{1F1EC}\u{1F1F3}", available: false },
  { code: "261", name: "Madagascar", flag: "\u{1F1F2}\u{1F1EC}", available: false },
  { code: "222", name: "Mauritanie", flag: "\u{1F1F2}\u{1F1F7}", available: false },
  { code: "257", name: "Burundi", flag: "\u{1F1E7}\u{1F1EE}", available: false },
  { code: "269", name: "Comores", flag: "\u{1F1F0}\u{1F1F2}", available: false },
  { code: "253", name: "Djibouti", flag: "\u{1F1E9}\u{1F1EF}", available: false },
  { code: "250", name: "Rwanda", flag: "\u{1F1F7}\u{1F1FC}", available: false },
];

export default function Register() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isMobile } = useResponsive();
  const { invitation } = useLocalSearchParams<{ invitation?: string }>();
  const hasInvitation = !!invitation;
  const [form, setForm] = useState({
    entrepriseNom: "",
    pays: "242",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedCountry = COUNTRIES.find((c) => c.code === form.pays) || COUNTRIES[0];

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
        pays: form.pays,
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
    fontFamily: fonts.regular,
    fontWeight: fontWeights.regular,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: isMobile ? 12 : 24, paddingVertical: isMobile ? 16 : 24 }}>
        <View style={{ width: "100%", maxWidth: isMobile ? undefined : 520, backgroundColor: colors.card, padding: isMobile ? 16 : 32, borderRadius: isMobile ? 12 : 16 }}>
          <AuthLogo size={isMobile ? "sm" : "md"} />

          <Text style={{ fontFamily: fonts.heading, fontWeight: fontWeights.heading, fontSize: isMobile ? 20 : 24, color: colors.text, marginBottom: 4 }}>
            {hasInvitation ? t("auth.joinTeam") : t("auth.createCompany")}
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: isMobile ? 13 : 14, color: colors.textMuted, marginBottom: isMobile ? 16 : 24 }}>
            {hasInvitation ? t("auth.invitedDescription") : t("auth.companyAdmin")}
          </Text>

          {/* Bannière invitation */}
          {hasInvitation && (
            <View style={{ backgroundColor: colors.primary + "15", borderLeftWidth: 4, borderLeftColor: colors.primary, padding: isMobile ? 10 : 12, marginBottom: isMobile ? 12 : 16, borderRadius: 8 }}>
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, color: colors.primary, fontSize: isMobile ? 13 : 14 }}>
                {t("auth.invitedBanner")}
              </Text>
            </View>
          )}

          {/* Erreur */}
          {error ? (
            <View style={{ backgroundColor: colors.danger + "15", padding: isMobile ? 10 : 12, marginBottom: isMobile ? 12 : 16, borderRadius: 8 }}>
              <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, color: colors.danger, fontSize: isMobile ? 13 : 14 }}>{error}</Text>
            </View>
          ) : null}

          {/* Nom du cabinet (masqué si invitation) */}
          {!hasInvitation && (
            <>
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: isMobile ? 13 : 14, color: colors.text, marginBottom: isMobile ? 6 : 8 }}>
                {t("auth.company")} <Text style={{ color: colors.danger }}>*</Text>
              </Text>
              <TextInput
                style={{ ...inputStyle, marginBottom: isMobile ? 12 : 16 }}
                placeholder={t("auth.companyPlaceholder")}
                placeholderTextColor={colors.textMuted}
                value={form.entrepriseNom}
                onChangeText={(v) => updateField("entrepriseNom", v)}
                accessibilityLabel={t("auth.company")}
              />
            </>
          )}

          {/* Pays */}
          <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: isMobile ? 13 : 14, color: colors.text, marginBottom: isMobile ? 6 : 8 }}>
            {t("auth.country")} <Text style={{ color: colors.danger }}>*</Text>
          </Text>
          <TouchableOpacity
            onPress={() => setShowCountryPicker(true)}
            style={{
              ...inputStyle,
              marginBottom: isMobile ? 12 : 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            accessibilityLabel={t("auth.chooseCountry")}
            accessibilityRole="button"
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Text style={{ fontSize: 20 }}>{selectedCountry.flag}</Text>
              <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: isMobile ? 15 : 16, color: colors.text }}>
                {selectedCountry.name}
              </Text>
              {!selectedCountry.available && (
                <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 10, color: colors.textMuted, textTransform: "uppercase" }}>{t("common.comingSoon")}</Text>
              )}
            </View>
            <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <Modal visible={showCountryPicker} transparent animationType="fade">
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setShowCountryPicker(false)}
              style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 24 }}
            >
              <View style={{ width: "100%", maxWidth: 400, maxHeight: "70%", backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
                <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                  <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 16, color: colors.text }}>{t("auth.chooseCountry")}</Text>
                </View>
                <FlatList
                  data={COUNTRIES}
                  keyExtractor={(item) => item.code}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        if (item.available) {
                          updateField("pays", item.code);
                          setShowCountryPicker(false);
                        }
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 14,
                        paddingHorizontal: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                        backgroundColor: item.code === form.pays ? colors.primary + "15" : "transparent",
                        opacity: item.available ? 1 : 0.4,
                      }}
                    >
                      <Text style={{ fontSize: 22, marginRight: 12 }}>{item.flag}</Text>
                      <Text style={{ fontFamily: item.code === form.pays ? fonts.bold : fonts.regular, fontWeight: item.code === form.pays ? fontWeights.bold : fontWeights.regular, flex: 1, fontSize: 15, color: colors.text }}>
                        {item.name}
                      </Text>
                      <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 13, color: colors.textMuted }}>+{item.code}</Text>
                      {!item.available && (
                        <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 10, color: colors.textMuted, marginLeft: 8 }}>{t("common.comingSoon")}</Text>
                      )}
                      {item.code === form.pays && (
                        <Ionicons name="checkmark" size={18} color={colors.primary} style={{ marginLeft: 8 }} />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Nom + Prénom */}
          <View style={{ flexDirection: isMobile ? "column" : "row", gap: isMobile ? 10 : 16, marginBottom: isMobile ? 12 : 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: isMobile ? 13 : 14, color: colors.text, marginBottom: isMobile ? 6 : 8 }}>
                {t("auth.lastName")} <Text style={{ color: colors.danger }}>*</Text>
              </Text>
              <TextInput
                style={inputStyle}
                placeholder={t("auth.lastName")}
                placeholderTextColor={colors.textMuted}
                value={form.nom}
                onChangeText={(v) => updateField("nom", v)}
                accessibilityLabel={t("auth.lastName")}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: isMobile ? 13 : 14, color: colors.text, marginBottom: isMobile ? 6 : 8 }}>
                {t("auth.firstName")} <Text style={{ color: colors.danger }}>*</Text>
              </Text>
              <TextInput
                style={inputStyle}
                placeholder={t("auth.firstName")}
                placeholderTextColor={colors.textMuted}
                value={form.prenom}
                onChangeText={(v) => updateField("prenom", v)}
                accessibilityLabel={t("auth.firstName")}
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
          <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: isMobile ? 13 : 14, color: colors.text, marginBottom: isMobile ? 6 : 8 }}>
            {t("auth.phone")}
          </Text>
          <TextInput
            style={{ ...inputStyle, marginBottom: isMobile ? 12 : 16 }}
            placeholder={t("auth.phonePlaceholder")}
            placeholderTextColor={colors.textMuted}
            value={form.telephone}
            onChangeText={(v) => updateField("telephone", v.replace(/[^\d\s+()-]/g, ""))}
            keyboardType="phone-pad"
            accessibilityLabel={t("auth.phone")}
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
            accessibilityLabel={t("auth.createAccount")}
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, color: colors.sidebarText, fontSize: isMobile ? 15 : 16 }}>
                {t("auth.createAccount")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Lien connexion */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: isMobile ? 16 : 24 }}>
            <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: isMobile ? 13 : 14, color: colors.textMuted }}>{t("auth.alreadyHaveAccount")} </Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/")} accessibilityLabel={t("auth.signIn")} accessibilityRole="link">
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: isMobile ? 13 : 14, color: colors.primary, textDecorationLine: "underline" }}>
                {t("auth.signIn")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
