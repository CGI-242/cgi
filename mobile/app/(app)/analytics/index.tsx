import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Share,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  analyticsApi,
  type DashboardData,
  type TimeSeriesPoint,
  type MemberStat,
} from "@/lib/api/analytics";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

export default function AnalyticsScreen() {
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6" }}>
        <ActivityIndicator size="large" color="#00815d" />
        <Text style={{ marginTop: 12, color: "#6b7280", fontSize: 14 }}>Chargement...</Text>
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
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      {/* Header */}
      <View style={{ backgroundColor: "#1a1a1a", paddingTop: Platform.OS === "ios" ? 56 : 16, paddingBottom: 16, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Analytiques</Text>
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Statistiques d'utilisation</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {/* Sélecteur période */}
            {[30, 60].map((d) => (
              <TouchableOpacity
                key={d}
                onPress={() => setDays(d)}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 6,
                  backgroundColor: days === d ? "#00815d" : "rgba(255,255,255,0.1)",
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "600", color: "#fff" }}>{d}j</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={loadData} style={{ padding: 8 }}>
              <Ionicons name="refresh-outline" size={20} color="#00c17c" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {error && (
          <View style={{ backgroundColor: "#fef2f2", borderRadius: 12, padding: 16, marginBottom: 12 }}>
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
                backgroundColor: "#fff",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#e5e7eb",
                padding: 16,
              }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: card.bg, justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                <Ionicons name={card.icon} size={18} color={card.color} />
              </View>
              <Text style={{ fontSize: 22, fontWeight: "800", color: "#1f2937" }}>{card.value}</Text>
              <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{card.label}</Text>
            </View>
          ))}
        </View>

        {/* Time series */}
        {timeSeries.length > 0 && (
          <>
            <Text style={{ color: "#6b7280", fontSize: 12, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>
              ACTIVITÉ ({days} DERNIERS JOURS)
            </Text>
            <View style={{ backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", padding: 16, marginBottom: 20 }}>
              {timeSeries.slice(-14).map((point) => {
                const widthPercent = Math.max((point.count / maxCount) * 100, 2);
                return (
                  <View key={point.date} style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                    <Text style={{ fontSize: 11, color: "#6b7280", width: 50 }}>{formatDate(point.date)}</Text>
                    <View style={{ flex: 1, marginHorizontal: 8 }}>
                      <View
                        style={{
                          height: 16,
                          width: `${widthPercent}%` as `${number}%`,
                          backgroundColor: "#00815d",
                          borderRadius: 4,
                        }}
                      />
                    </View>
                    <Text style={{ fontSize: 12, fontWeight: "600", color: "#374151", width: 30, textAlign: "right" }}>{point.count}</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Stats membres */}
        {memberStats.length > 0 && (
          <>
            <Text style={{ color: "#6b7280", fontSize: 12, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>
              STATISTIQUES MEMBRES
            </Text>
            <View style={{ backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", overflow: "hidden", marginBottom: 20 }}>
              {memberStats.map((member, index) => {
                const initials = (member.name || member.email).substring(0, 2).toUpperCase();
                return (
                  <View
                    key={member.userId}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 14,
                      borderTopWidth: index > 0 ? 1 : 0,
                      borderTopColor: "#f3f4f6",
                    }}
                  >
                    <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: "#eff6ff", justifyContent: "center", alignItems: "center", marginRight: 10 }}>
                      <Text style={{ fontSize: 12, fontWeight: "700", color: "#3b82f6" }}>{initials}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: "#1f2937" }}>{member.name || member.email}</Text>
                      <Text style={{ fontSize: 11, color: "#9ca3af" }}>
                        Dernière activité : {member.lastActive ? formatDate(member.lastActive) : "-"}
                      </Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={{ fontSize: 16, fontWeight: "700", color: "#374151" }}>{member.questionsCount}</Text>
                      <Text style={{ fontSize: 10, color: "#9ca3af" }}>questions</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Export CSV */}
        <TouchableOpacity
          onPress={handleExport}
          disabled={exporting}
          style={{ backgroundColor: "#00815d", borderRadius: 12, paddingVertical: 14, alignItems: "center" }}
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
