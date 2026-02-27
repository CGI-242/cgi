import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  alertesApi,
  type AlerteFiscale,
  type AlerteStats,
} from "@/lib/api/alertes";

const URGENCE_COLORS: Record<string, string> = {
  haute: "#dc2626",
  moyenne: "#d97706",
  basse: "#16a34a",
};

const URGENCE_LABELS: Record<string, string> = {
  haute: "Haute",
  moyenne: "Moyenne",
  basse: "Basse",
};

export default function AlertesScreen() {
  const [alertes, setAlertes] = useState<AlerteFiscale[]>([]);
  const [stats, setStats] = useState<AlerteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filtres
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterCategorie, setFilterCategorie] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, alertesData] = await Promise.all([
        alertesApi.getStats(),
        alertesApi.getAlertes({
          type: filterType || undefined,
          categorie: filterCategorie || undefined,
        }),
      ]);
      setStats(statsData);
      setAlertes(alertesData.alertes);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [filterType, filterCategorie]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const types = stats?.parType ? Object.keys(stats.parType) : [];
  const categories = stats?.parCategorie ? Object.keys(stats.parCategorie) : [];

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6" }}>
        <ActivityIndicator size="large" color="#00815d" />
        <Text style={{ marginTop: 12, color: "#6b7280", fontSize: 14 }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      {/* Header */}
      <View style={{ backgroundColor: "#1a1a1a", paddingTop: Platform.OS === "ios" ? 56 : 16, paddingBottom: 16, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Alertes Fiscales</Text>
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Veille réglementaire</Text>
            </View>
          </View>
          <TouchableOpacity onPress={loadData} style={{ padding: 8 }}>
            <Ionicons name="refresh-outline" size={20} color="#00c17c" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {error && (
          <View style={{ backgroundColor: "#fef2f2", borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <Text style={{ color: "#dc2626", fontSize: 14 }}>{error}</Text>
          </View>
        )}

        {/* Stats badges */}
        {stats && (
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
            <View style={{ flex: 1, backgroundColor: "#f0fdf4", borderRadius: 10, padding: 12, alignItems: "center" }}>
              <Text style={{ fontSize: 22, fontWeight: "800", color: "#374151" }}>{stats.total}</Text>
              <Text style={{ fontSize: 11, color: "#374151", fontWeight: "500" }}>Total</Text>
            </View>
            {Object.entries(stats.parUrgence || {}).map(([urgence, count]) => {
              const color = URGENCE_COLORS[urgence] || "#6b7280";
              return (
                <View key={urgence} style={{ flex: 1, backgroundColor: `${color}10`, borderRadius: 10, padding: 12, alignItems: "center" }}>
                  <Text style={{ fontSize: 22, fontWeight: "800", color }}>{count}</Text>
                  <Text style={{ fontSize: 11, color, fontWeight: "500" }}>{URGENCE_LABELS[urgence] || urgence}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Filtres type */}
        {types.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
            <TouchableOpacity
              onPress={() => setFilterType(null)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 16,
                backgroundColor: !filterType ? "#00815d" : "#e5e7eb",
                marginRight: 8,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: !filterType ? "#fff" : "#374151" }}>Tous</Text>
            </TouchableOpacity>
            {types.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setFilterType(filterType === type ? null : type)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor: filterType === type ? "#00815d" : "#e5e7eb",
                  marginRight: 8,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: "600", color: filterType === type ? "#fff" : "#374151" }}>{type}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Filtres catégorie */}
        {categories.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            <TouchableOpacity
              onPress={() => setFilterCategorie(null)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 16,
                backgroundColor: !filterCategorie ? "#374151" : "#e5e7eb",
                marginRight: 8,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: !filterCategorie ? "#fff" : "#374151" }}>Toutes</Text>
            </TouchableOpacity>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setFilterCategorie(filterCategorie === cat ? null : cat)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor: filterCategorie === cat ? "#374151" : "#e5e7eb",
                  marginRight: 8,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: "600", color: filterCategorie === cat ? "#fff" : "#374151" }}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Liste alertes */}
        {alertes.map((alerte) => {
          const urgenceColor = URGENCE_COLORS[alerte.urgence] || "#6b7280";
          const isExpanded = expandedId === alerte.id;

          return (
            <TouchableOpacity
              key={alerte.id}
              onPress={() => setExpandedId(isExpanded ? null : alerte.id)}
              activeOpacity={0.7}
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderLeftWidth: 4,
                borderLeftColor: urgenceColor,
                marginBottom: 10,
                padding: 14,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={{ fontSize: 15, fontWeight: "600", color: "#1f2937", marginBottom: 6 }}>
                    {alerte.title}
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
                    <View style={{ backgroundColor: `${urgenceColor}15`, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                      <Text style={{ fontSize: 11, fontWeight: "700", color: urgenceColor }}>
                        {URGENCE_LABELS[alerte.urgence] || alerte.urgence}
                      </Text>
                    </View>
                    <View style={{ backgroundColor: "#eff6ff", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                      <Text style={{ fontSize: 11, fontWeight: "600", color: "#3b82f6" }}>{alerte.type}</Text>
                    </View>
                    <View style={{ backgroundColor: "#f3f4f6", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                      <Text style={{ fontSize: 11, fontWeight: "600", color: "#6b7280" }}>{alerte.categorie}</Text>
                    </View>
                  </View>
                  {alerte.articleRef && (
                    <Text style={{ fontSize: 12, color: "#9ca3af" }}>Art. {alerte.articleRef}</Text>
                  )}
                </View>
                <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color="#9ca3af" />
              </View>
              {isExpanded && (
                <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#f3f4f6" }}>
                  <Text style={{ fontSize: 14, color: "#374151", lineHeight: 20 }}>
                    {alerte.description}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {alertes.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Ionicons name="notifications-off-outline" size={40} color="#d1d5db" />
            <Text style={{ marginTop: 8, color: "#9ca3af", fontSize: 14 }}>Aucune alerte fiscale</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
