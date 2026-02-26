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
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/lib/store/auth";
import { userApi, type UserProfile } from "@/lib/api/user";

function getInitials(firstName?: string | null, lastName?: string | null) {
  return ((firstName?.[0] || "") + (lastName?.[0] || "")).toUpperCase() || "U";
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function ProfilScreen() {
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

      setMessage({ type: "success", text: "Profil mis à jour avec succès" });
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || "Erreur lors de la mise à jour";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#f3f4f6", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00815d" />
      </View>
    );
  }

  const initials = getInitials(firstName, lastName);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f3f4f6" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View
        style={{
          backgroundColor: "#1a1a1a",
          paddingTop: Platform.OS === "ios" ? 56 : 16,
          paddingBottom: 16,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", flex: 1 }}>Mon profil</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Avatar + Email */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "#00815d",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 28, fontWeight: "bold" }}>{initials}</Text>
          </View>
          <Text style={{ color: "#6b7280", fontSize: 14 }}>{email}</Text>
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
        <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <FieldInput label="Prénom" value={firstName} onChangeText={setFirstName} placeholder="Votre prénom" />
          <FieldInput label="Nom" value={lastName} onChangeText={setLastName} placeholder="Votre nom" />
          <FieldInput
            label="Téléphone"
            value={phone}
            onChangeText={setPhone}
            placeholder="+242 06 XXX XX XX"
            keyboardType="phone-pad"
          />
          <FieldInput
            label="Profession"
            value={profession}
            onChangeText={setProfession}
            placeholder="Ex: Fiscaliste, Comptable..."
            isLast
          />
        </View>

        {/* Date inscription */}
        {createdAt ? (
          <Text style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, marginBottom: 24 }}>
            Membre depuis : {formatDate(createdAt)}
          </Text>
        ) : null}

        {/* Bouton Enregistrer en bas à droite */}
        <View style={{ alignItems: "flex-end" }}>
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={{
              backgroundColor: saving ? "#86efac" : "#00815d",
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
              {saving ? "Enregistrement..." : "Enregistrer"}
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
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "phone-pad" | "email-address";
  isLast?: boolean;
}) {
  return (
    <View style={{ marginBottom: isLast ? 0 : 16 }}>
      <Text style={{ color: "#6b7280", fontSize: 13, marginBottom: 6, fontWeight: "600" }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#d1d5db"
        keyboardType={keyboardType || "default"}
        style={{
          borderWidth: 1,
          borderColor: "#e5e7eb",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          fontSize: 15,
          color: "#1f2937",
          backgroundColor: "#f9fafb",
        }}
      />
    </View>
  );
}
