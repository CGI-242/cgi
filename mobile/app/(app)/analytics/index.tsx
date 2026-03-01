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
import {
  analyticsApi,
  type DashboardData,
  type TimeSeriesPoint,
  type MemberStat,
} from "@/lib/api/analytics";
import { useTheme } from "@/lib/theme/ThemeContext";
import PeriodSelector from "@/components/analytics/PeriodSelector";
import MemberStatsTable from "@/components/analytics/MemberStatsTable";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

export default function AnalyticsScreen() {
  const { colors } = useTheme();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>([]);
  const [memberStats, setMemberStats] = useState<MemberStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);
  const [exporting, setExporting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashData, tsData, msData] = await Promise.all([
        analyticsApi.getDashboard(),
        analyticsApi.getTimeSeries(days),
        analyticsApi.getMemberStats(),
      ]);
      setDashboard(dashData);
      setTimeSeries(tsData);
      setMemberStats(msData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleExport = async () => {
    setExporting(true);
    try {
      await analyticsApi.exportCsv(days);
      Alert.alert("Export", "Le fichier CSV a été téléchargé");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur d'export";
      Alert.alert("Erreur", msg);
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
  };

  const maxCount = timeSeries.length > 0 ? Math.max(...timeSeries.map((p) => p.count), 1) : 1;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.textSecondary, fontSize: 14 }}>Chargement...</Text>
      </View>
    );
  }

  const statCards: { label: string; value: string | number; icon: IoniconsName; color: string; bg: string }[] = dashboard
    ? [
        { label: "Questions totales", value: dashboard.totalQuestions, icon: "chatbubble-ellipses-outline", color: "#3b82f6", bg: "#eff6ff" },
        { label: "Tendance", value: `${dashboard.trend > 0 ? "+" : ""}${dashboard.trend}%`, icon: "trending-up-outline", color: dashboard.trend >= 0 ? "#16a34a" : "#dc2626", bg: dashboard.trend >= 0 ? "#f0fdf4" : "#fef2f2" },
        { label: "Membres actifs", value: `${dashboard.activeMembers}/${dashboard.totalMembers}`, icon: "people-outline", color: "#8b5cf6", bg: "#faf5ff" },
        { label: "Ce mois", value: dashboard.questionsThisMonth, icon: "calendar-outline", color: "#d97706", bg: "#fffbeb" },
      ]
    : [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Toolbar: period selector + refresh */}
        <PeriodSelector days={days} onChangeDays={setDays} onRefresh={loadData} colors={colors} />

        {error && (
          <View style={{ backgroundColor: "#fef2f2", padding: 16, marginBottom: 12 }}>
            <Text style={{ color: "#dc2626", fontSize: 14 }}>{error}</Text>
          </View>
        )}

        {/* Stats cards 2x2 */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
          {statCards.map((card) => (
            <View
              key={card.label}
              style={{
                width: "48%",
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 16,
              }}
            >
              <View style={{ width: 36, height: 36, backgroundColor: card.bg, justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                <Ionicons name={card.icon} size={18} color={card.color} />
              </View>
              <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text }}>{card.value}</Text>
              <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>{card.label}</Text>
            </View>
          ))}
        </View>

        {/* Time series */}
        {timeSeries.length > 0 && (
          <>
            <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>
              ACTIVITÉ ({days} DERNIERS JOURS)
            </Text>
            <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 20 }}>
              {timeSeries.slice(-14).map((point) => {
                const widthPercent = Math.max((point.count / maxCount) * 100, 2);
                return (
                  <View key={point.date} style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                    <Text style={{ fontSize: 11, color: colors.textSecondary, width: 50 }}>{formatDate(point.date)}</Text>
                    <View style={{ flex: 1, marginHorizontal: 8 }}>
                      <View
                        style={{
                          height: 16,
                          width: `${widthPercent}%` as `${number}%`,
                          backgroundColor: colors.primary,
                        }}
                      />
                    </View>
                    <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, width: 30, textAlign: "right" }}>{point.count}</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Stats membres */}
        <MemberStatsTable memberStats={memberStats} formatDate={formatDate} colors={colors} />

        {/* Export CSV */}
        <TouchableOpacity
          onPress={handleExport}
          disabled={exporting}
          style={{ backgroundColor: colors.primary, paddingVertical: 14, alignItems: "center" }}
        >
          {exporting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="download-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>Exporter en CSV</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
