import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

interface Props {
  firstName: string;
  lastName: string;
  phone: string;
  profession: string;
  saving: boolean;
  message: { type: "success" | "error"; text: string } | null;
  createdAt: string;
  onChangeFirstName: (v: string) => void;
  onChangeLastName: (v: string) => void;
  onChangePhone: (v: string) => void;
  onChangeProfession: (v: string) => void;
  onSave: () => void;
  colors: any;
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

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function ProfileForm({
  firstName,
  lastName,
  phone,
  profession,
  saving,
  message,
  createdAt,
  onChangeFirstName,
  onChangeLastName,
  onChangePhone,
  onChangeProfession,
  onSave,
  colors,
}: Props) {
  const { t } = useTranslation();

  return (
    <>
      {/* Message feedback */}
      {message && (
        <View
          style={{
            backgroundColor: message.type === "success" ? "#d1fae5" : "#fee2e2",
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
      <View style={{ backgroundColor: colors.card, padding: 16, marginBottom: 16 }}>
        <FieldInput label={t("auth.firstName")} value={firstName} onChangeText={onChangeFirstName} placeholder={t("auth.firstNamePlaceholder")} colors={colors} />
        <FieldInput label={t("auth.lastName")} value={lastName} onChangeText={onChangeLastName} placeholder={t("auth.lastNamePlaceholder")} colors={colors} />
        <FieldInput
          label={t("auth.phone")}
          value={phone}
          onChangeText={onChangePhone}
          placeholder={t("auth.phonePlaceholder")}
          keyboardType="phone-pad"
          colors={colors}
        />
        <FieldInput
          label="Profession"
          value={profession}
          onChangeText={onChangeProfession}
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
          onPress={onSave}
          disabled={saving}
          style={{
            backgroundColor: saving ? colors.accent : colors.primary,
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
    </>
  );
}
