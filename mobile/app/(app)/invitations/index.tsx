import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { organizationApi } from "@/lib/api/organization";
import { useTheme } from "@/lib/theme/ThemeContext";

export default function InvitationsScreen() {
  const { colors } = useTheme();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    if (!token.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await organizationApi.acceptInvitation(token.trim());
      setSuccess(result.message || "Invitation acceptée avec succès");
      setToken("");
      // Rediriger vers l'organisation après acceptation
      setTimeout(() => router.replace("/(app)/organisation"), 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'acceptation";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* En-tête */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: `${colors.primary}20`, justifyContent: "center", alignItems: "center", marginBottom: 12 }}>
            <Ionicons name="mail-open-outline" size={32} color={colors.primary} />
          </View>
          <Text style={{ fontSize: 20, fontWeight: "700", color: colors.text, textAlign: "center" }}>
            Accepter une invitation
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: "center", marginTop: 4 }}>
            Entrez le token d'invitation reçu par email pour rejoindre une organisation
          </Text>
        </View>

        {/* Messages */}
        {error && (
          <View style={{ backgroundColor: "#fef2f2", borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <Text style={{ color: "#dc2626", fontSize: 14 }}>{error}</Text>
          </View>
        )}

        {success && (
          <View style={{ backgroundColor: "#f0fdf4", borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <Text style={{ color: "#16a34a", fontSize: 14 }}>{success}</Text>
          </View>
        )}

        {/* Formulaire */}
        <View style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
            Token d'invitation
          </Text>
          <TextInput
            value={token}
            onChangeText={(v) => { setToken(v); setError(null); setSuccess(null); }}
            placeholder="Collez votre token d'invitation ici"
            placeholderTextColor={colors.textMuted}
            style={{
              backgroundColor: colors.background,
              borderRadius: 8,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 15,
              color: colors.text,
              marginBottom: 16,
            }}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={handleAccept}
            disabled={loading || !token.trim()}
            style={{
              backgroundColor: !token.trim() ? colors.textMuted : colors.primary,
              borderRadius: 8,
              paddingVertical: 14,
              alignItems: "center",
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>Accepter l'invitation</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
