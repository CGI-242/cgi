import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Modal, FlatList } from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/lib/store/auth";
import { useResponsive } from "@/lib/hooks/useResponsive";
import { authApi } from "@/lib/api/auth";
import axios from "axios";
import EmailField from "@/components/auth/EmailField";
import PasswordFields from "@/components/auth/PasswordFields";
import { fonts, fontWeights } from "@/lib/theme/fonts";
import AuthLogo from "@/components/auth/AuthLogo";
import TurnstileWidget from "@/components/auth/TurnstileWidget";

const BG = "#1A3A5C";
const GOLD = "#D4A843";

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

const authColors = {
  text: "#e8e6e1",
  textMuted: "rgba(255,255,255,0.55)",
  input: "rgba(255,255,255,0.08)",
  primary: GOLD,
  danger: "#ef4444",
  border: "rgba(255,255,255,0.12)",
  success: "#22c55e",
  sidebarText: BG,
  card: BG,
  background: "#ffffff",
};

export default function Register() {
  const { t } = useTranslation();
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
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const selectedCountry = COUNTRIES.find((c) => c.code === form.pays) || COUNTRIES[0];

  const setEmail = useAuthStore((s) => s.setEmail);
  const setUser = useAuthStore((s) => s.setUser);
  const setOtpSource = useAuthStore((s) => s.setOtpSource);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
    if (key === "email") {
      setEmailError("");
    }
  };

  // Vérification email supprimée — anti-énumération (CRIT-01)
  // La validation se fait côté serveur lors du register

  const handleRegister = async () => {
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
        turnstileToken: turnstileToken ?? undefined,
      });
      setUser(data.user ?? null);
      setEmail(form.email.trim());
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
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: isMobile ? 10 : 12,
    fontSize: isMobile ? 15 : 16,
    color: "#e8e6e1",
    borderRadius: 8,
    fontFamily: fonts.regular,
    fontWeight: fontWeights.regular,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#ffffff" }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: isMobile ? 12 : 24, paddingVertical: isMobile ? 16 : 24 }}>
        <View style={{ width: "100%", maxWidth: isMobile ? undefined : 520, backgroundColor: BG, padding: isMobile ? 16 : 32, borderRadius: isMobile ? 12 : 16 }}>
          <AuthLogo size={isMobile ? "sm" : "md"} />

          <Text style={{ fontFamily: fonts.heading, fontWeight: fontWeights.heading, fontSize: isMobile ? 20 : 24, color: "#e8e6e1", marginBottom: 4 }}>
            {hasInvitation ? t("auth.joinTeam") : t("auth.createCompany")}
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: isMobile ? 13 : 14, color: "rgba(255,255,255,0.55)", marginBottom: isMobile ? 16 : 24 }}>
            {hasInvitation ? t("auth.invitedDescription") : t("auth.companyAdmin")}
          </Text>

          {/* Bannière invitation */}
          {hasInvitation && (
            <View style={{ backgroundColor: GOLD + "15", borderLeftWidth: 4, borderLeftColor: GOLD, padding: isMobile ? 10 : 12, marginBottom: isMobile ? 12 : 16, borderRadius: 8 }}>
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, color: GOLD, fontSize: isMobile ? 13 : 14 }}>
                {t("auth.invitedBanner")}
              </Text>
            </View>
          )}

          {/* Erreur */}
          {error ? (
            <View style={{ backgroundColor: "rgba(239,68,68,0.08)", padding: isMobile ? 10 : 12, marginBottom: isMobile ? 12 : 16, borderRadius: 8 }}>
              <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, color: "#ef4444", fontSize: isMobile ? 13 : 14 }}>{error}</Text>
            </View>
          ) : null}

          {/* Nom du cabinet (masqué si invitation) */}
          {!hasInvitation && (
            <>
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: isMobile ? 13 : 14, color: "#e8e6e1", marginBottom: isMobile ? 6 : 8 }}>
                {t("auth.company")} <Text style={{ color: "#f87171" }}>*</Text>
              </Text>
              <TextInput
                style={{ ...inputStyle, marginBottom: isMobile ? 12 : 16 }}
                placeholder={t("auth.companyPlaceholder")}
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={form.entrepriseNom}
                onChangeText={(v) => updateField("entrepriseNom", v)}
                accessibilityLabel={t("auth.company")}
              />
            </>
          )}

          {/* Pays */}
          <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: isMobile ? 13 : 14, color: "#e8e6e1", marginBottom: isMobile ? 6 : 8 }}>
            {t("auth.country")} <Text style={{ color: "#f87171" }}>*</Text>
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
              <Text style={{ fontSize: 22 }}>{selectedCountry.flag}</Text>
              <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: isMobile ? 15 : 16, color: "#e8e6e1" }}>
                {selectedCountry.name}
              </Text>
              {!selectedCountry.available && (
                <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 12, color: "rgba(255,255,255,0.55)", textTransform: "uppercase" }}>{t("common.comingSoon")}</Text>
              )}
            </View>
            <Ionicons name="chevron-down" size={18} color="rgba(255,255,255,0.55)" />
          </TouchableOpacity>

          <Modal visible={showCountryPicker} transparent animationType="fade">
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setShowCountryPicker(false)}
              style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 24 }}
            >
              <View style={{ width: "100%", maxWidth: 400, maxHeight: "70%", backgroundColor: BG, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }}>
                <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.12)" }}>
                  <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 18, color: "#e8e6e1" }}>{t("auth.chooseCountry")}</Text>
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
                        borderBottomColor: "rgba(255,255,255,0.12)",
                        backgroundColor: item.code === form.pays ? GOLD + "15" : "transparent",
                        opacity: item.available ? 1 : 0.4,
                      }}
                    >
                      <Text style={{ fontSize: 24, marginRight: 12 }}>{item.flag}</Text>
                      <Text style={{ fontFamily: item.code === form.pays ? fonts.bold : fonts.regular, fontWeight: item.code === form.pays ? fontWeights.bold : fontWeights.regular, flex: 1, fontSize: 17, color: "#e8e6e1" }}>
                        {item.name}
                      </Text>
                      <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 15, color: "rgba(255,255,255,0.55)" }}>+{item.code}</Text>
                      {!item.available && (
                        <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 12, color: "rgba(255,255,255,0.55)", marginLeft: 8 }}>{t("common.comingSoon")}</Text>
                      )}
                      {item.code === form.pays && (
                        <Ionicons name="checkmark" size={18} color={GOLD} style={{ marginLeft: 8 }} />
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
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: isMobile ? 13 : 14, color: "#e8e6e1", marginBottom: isMobile ? 6 : 8 }}>
                {t("auth.lastName")} <Text style={{ color: "#f87171" }}>*</Text>
              </Text>
              <TextInput
                style={inputStyle}
                placeholder={t("auth.lastName")}
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={form.nom}
                onChangeText={(v) => updateField("nom", v)}
                accessibilityLabel={t("auth.lastName")}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: isMobile ? 13 : 14, color: "#e8e6e1", marginBottom: isMobile ? 6 : 8 }}>
                {t("auth.firstName")} <Text style={{ color: "#f87171" }}>*</Text>
              </Text>
              <TextInput
                style={inputStyle}
                placeholder={t("auth.firstName")}
                placeholderTextColor="rgba(255,255,255,0.35)"
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
            emailChecking={false}
            onChangeEmail={(v) => updateField("email", v)}
            colors={authColors}
          />

          {/* Téléphone */}
          <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: isMobile ? 13 : 14, color: "#e8e6e1", marginBottom: isMobile ? 6 : 8 }}>
            {t("auth.phone")}
          </Text>
          <TextInput
            style={{ ...inputStyle, marginBottom: isMobile ? 12 : 16 }}
            placeholder={t("auth.phonePlaceholder")}
            placeholderTextColor="rgba(255,255,255,0.35)"
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
            colors={authColors}
          />

          <TurnstileWidget onToken={setTurnstileToken} />

          {/* Bouton */}
          <TouchableOpacity
            style={{ width: "100%", backgroundColor: GOLD, padding: isMobile ? 14 : 16, alignItems: "center", marginTop: isMobile ? 4 : 8, borderRadius: 10, opacity: loading ? 0.7 : 1 }}
            onPress={handleRegister}
            activeOpacity={0.8}
            disabled={loading}
            accessibilityLabel={t("auth.createAccount")}
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, color: BG, fontSize: isMobile ? 15 : 16 }}>
                {t("auth.createAccount")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Lien connexion */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: isMobile ? 16 : 24 }}>
            <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: isMobile ? 13 : 14, color: "rgba(255,255,255,0.55)" }}>{t("auth.alreadyHaveAccount")} </Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/")} accessibilityLabel={t("auth.signIn")} accessibilityRole="link">
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: isMobile ? 13 : 14, color: GOLD, textDecorationLine: "underline" }}>
                {t("auth.signIn")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
