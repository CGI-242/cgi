import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import {
  alertesApi,
  type AlerteFiscale,
  type AlerteStats,
} from "@/lib/api/alertes";
import { useAuthStore } from "@/lib/store/auth";
import { useTheme } from "@/lib/theme/ThemeContext";

const URGENCE_COLORS: Record<string, string> = {
  haute: "#dc2626",
  moyenne: "#d97706",
  basse: "#16a34a",
};

const URGENCE_TRANSLATION_KEYS: Record<string, string> = {
  haute: "alertes.urgency.high",
  moyenne: "alertes.urgency.medium",
  basse: "alertes.urgency.low",
};

export default function AlertesScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "ADMIN" || user?.role === "OWNER";

  const [alertes, setAlertes] = useState<AlerteFiscale[]>([]);
  const [stats, setStats] = useState<AlerteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [extractLoading, setExtractLoading] = useState(false);
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

  const handleExtract = async () => {
    setExtractLoading(true);
    try {
      const result = await alertesApi.extractAlertes();
      Alert.alert(t("alertes.extract"), `${result.count} alerte(s) extraite(s).`);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur";
      Alert.alert(t("common.error"), msg);
    } finally {
      setExtractLoading(false);
    }
  };

  const types = stats?.parType ? Object.keys(stats.parType) : [];
  const categories = stats?.parCategorie ? Object.keys(stats.parCategorie) : [];

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.textSecondary, fontSize: 14 }}>{t("common.loading")}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Toolbar: extract + refresh */}
      <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 16, paddingTop: 8, gap: 8 }}>
        {isAdmin && (
          <TouchableOpacity
            onPress={handleExtract}
            disabled={extractLoading}
            style={{ flexDirection: "row", alignItems: "center", backgroundColor: `${colors.primary}15`, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
          >
            {extractLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <>
                <Ionicons name="download-outline" size={16} color={colors.primary} style={{ marginRight: 4 }} />
                <Text style={{ color: colors.primary, fontSize: 13, fontWeight: "600" }}>{t("alertes.extract")}</Text>
              </>
            )}
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={loadData} style={{ padding: 8 }}>
          <Ionicons name="refresh-outline" size={20} color={colors.accent} />
        </TouchableOpacity>
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
            <View style={{ flex: 1, backgroundColor: colors.citationsBg, borderRadius: 10, padding: 12, alignItems: "center" }}>
              <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text }}>{stats.total}</Text>
              <Text style={{ fontSize: 11, color: colors.text, fontWeight: "500" }}>{t("common.total")}</Text>
            </View>
            {Object.entries(stats.parUrgence || {}).map(([urgence, count]) => {
              const color = URGENCE_COLORS[urgence] || colors.textSecondary;
              return (
                <View key={urgence} style={{ flex: 1, backgroundColor: `${color}10`, borderRadius: 10, padding: 12, alignItems: "center" }}>
                  <Text style={{ fontSize: 22, fontWeight: "800", color }}>{count}</Text>
                  <Text style={{ fontSize: 11, color, fontWeight: "500" }}>{URGENCE_TRANSLATION_KEYS[urgence] ? t(URGENCE_TRANSLATION_KEYS[urgence]) : urgence}</Text>
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
                backgroundColor: !filterType ? colors.primary : colors.border,
                marginRight: 8,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: !filterType ? "#fff" : colors.text }}>{t("common.all")}</Text>
            </TouchableOpacity>
            {types.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setFilterType(filterType === type ? null : type)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor: filterType === type ? colors.primary : colors.border,
                  marginRight: 8,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: "600", color: filterType === type ? "#fff" : colors.text }}>{type}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Filtres categorie */}
        {categories.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            <TouchableOpacity
              onPress={() => setFilterCategorie(null)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 16,
                backgroundColor: !filterCategorie ? colors.text : colors.border,
                marginRight: 8,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: !filterCategorie ? colors.card : colors.text }}>{t("common.allFeminine")}</Text>
            </TouchableOpacity>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setFilterCategorie(filterCategorie === cat ? null : cat)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor: filterCategorie === cat ? colors.text : colors.border,
                  marginRight: 8,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: "600", color: filterCategorie === cat ? colors.card : colors.text }}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Liste alertes */}
        {alertes.map((alerte) => {
          const urgenceColor = URGENCE_COLORS[alerte.urgence] || colors.textSecondary;
          const isExpanded = expandedId === alerte.id;

          return (
            <TouchableOpacity
              key={alerte.id}
              onPress={() => setExpandedId(isExpanded ? null : alerte.id)}
              activeOpacity={0.7}
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                borderLeftWidth: 4,
                borderLeftColor: urgenceColor,
                marginBottom: 10,
                padding: 14,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={{ fontSize: 15, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
                    {alerte.title}
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
                    <View style={{ backgroundColor: `${urgenceColor}15`, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                      <Text style={{ fontSize: 11, fontWeight: "700", color: urgenceColor }}>
                        {URGENCE_TRANSLATION_KEYS[alerte.urgence] ? t(URGENCE_TRANSLATION_KEYS[alerte.urgence]) : alerte.urgence}
                      </Text>
                    </View>
                    <View style={{ backgroundColor: "#eff6ff", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                      <Text style={{ fontSize: 11, fontWeight: "600", color: "#3b82f6" }}>{alerte.type}</Text>
                    </View>
                    <View style={{ backgroundColor: colors.background, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                      <Text style={{ fontSize: 11, fontWeight: "600", color: colors.textSecondary }}>{alerte.categorie}</Text>
                    </View>
                  </View>
                  {alerte.articleRef && (
                    <Text style={{ fontSize: 12, color: colors.textMuted }}>Art. {alerte.articleRef}</Text>
                  )}
                </View>
                <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color={colors.textMuted} />
              </View>
              {isExpanded && (
                <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.background }}>
                  <Text style={{ fontSize: 14, color: colors.text, lineHeight: 20 }}>
                    {alerte.description}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {alertes.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Ionicons name="notifications-off-outline" size={40} color={colors.disabled} />
            <Text style={{ marginTop: 8, color: colors.textMuted, fontSize: 14 }}>{t("alertes.noAlerts")}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
