import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";
import { userApi, type UserProfile } from "@/lib/api/user";
import { useTheme } from "@/lib/theme/ThemeContext";

function getInitials(firstName?: string | null, lastName?: string | null) {
  return ((firstName?.[0] || "") + (lastName?.[0] || "")).toUpperCase() || "U";
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function ProfilScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState("");
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { user: profile } = await userApi.getProfile();
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setPhone(profile.phone || "");
      setProfession(profile.profession || "");
      setEmail(profile.email);
      setCreatedAt(profile.createdAt);
    } catch {
      // Fallback sur les données du store
      if (user) {
        setFirstName(user.prenom || "");
        setLastName(user.nom || "");
        setPhone(user.telephone || "");
        setEmail(user.email || "");
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setMessage({ type: "error", text: t("profil.nameRequired") });
      return;
    }
    if (phone.trim() && !/^[+]?[\d\s()-]{6,20}$/.test(phone.trim())) {
      setMessage({ type: "error", text: t("profil.phoneInvalid") });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const { user: updated } = await userApi.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || null,
        profession: profession.trim() || null,
      });

      // Mettre à jour le store Zustand pour refléter les changements partout
      if (user) {
        setUser({
          ...user,
          prenom: updated.firstName || user.prenom,
          nom: updated.lastName || user.nom,
          telephone: updated.phone || undefined,
        });
      }

      setMessage({ type: "success", text: t("profil.updateSuccess") });
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || t("profil.updateError");
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const initials = getInitials(firstName, lastName);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Avatar + Email */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.primary,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 28, fontWeight: "bold" }}>{initials}</Text>
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{email}</Text>
        </View>

        {/* Message feedback */}
        {message && (
          <View
            style={{
              backgroundColor: message.type === "success" ? "#d1fae5" : "#fee2e2",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons
              name={message.type === "success" ? "checkmark-circle" : "alert-circle"}
              size={20}
              color={message.type === "success" ? "#059669" : "#dc2626"}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                color: message.type === "success" ? "#059669" : "#dc2626",
                fontSize: 14,
                flex: 1,
              }}
            >
              {message.text}
            </Text>
          </View>
        )}

        {/* Formulaire */}
        <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <FieldInput label={t("auth.firstName")} value={firstName} onChangeText={setFirstName} placeholder={t("auth.firstNamePlaceholder")} colors={colors} />
          <FieldInput label={t("auth.lastName")} value={lastName} onChangeText={setLastName} placeholder={t("auth.lastNamePlaceholder")} colors={colors} />
          <FieldInput
            label={t("auth.phone")}
            value={phone}
            onChangeText={setPhone}
            placeholder={t("auth.phonePlaceholder")}
            keyboardType="phone-pad"
            colors={colors}
          />
          <FieldInput
            label="Profession"
            value={profession}
            onChangeText={setProfession}
            placeholder={t("auth.professionPlaceholder")}
            isLast
            colors={colors}
          />
        </View>

        {/* Date inscription */}
        {createdAt ? (
          <Text style={{ textAlign: "center", color: colors.textMuted, fontSize: 13, marginBottom: 24 }}>
            {t("profil.memberSince")} {formatDate(createdAt)}
          </Text>
        ) : null}

        {/* Bouton Enregistrer en bas à droite */}
        <View style={{ alignItems: "flex-end" }}>
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={{
              backgroundColor: saving ? colors.accent : colors.primary,
              borderRadius: 10,
              paddingVertical: 12,
              paddingHorizontal: 24,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
            ) : (
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            )}
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>
              {saving ? t("common.saving") : t("common.save")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FieldInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  isLast,
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "phone-pad" | "email-address";
  isLast?: boolean;
  colors: any;
}) {
  return (
    <View style={{ marginBottom: isLast ? 0 : 16 }}>
      <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 6, fontWeight: "600" }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.disabled}
        keyboardType={keyboardType || "default"}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          fontSize: 15,
          color: colors.text,
          backgroundColor: colors.input,
        }}
      />
    </View>
  );
}
