import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  auditApi,
  type AuditLog,
  type AuditStats,
} from "@/lib/api/audit";
import { useTheme } from "@/lib/theme/ThemeContext";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const ACTION_LABELS: Record<string, string> = {
  CREATE: "Création",
  UPDATE: "Modification",
  DELETE: "Suppression",
  LOGIN: "Connexion",
  LOGOUT: "Déconnexion",
  INVITE: "Invitation",
  EXPORT: "Export",
  GRANT: "Attribution",
  REVOKE: "Révocation",
};

const ACTION_ICONS: Record<string, { icon: IoniconsName; color: string }> = {
  CREATE: { icon: "add-circle-outline", color: "#16a34a" },
  UPDATE: { icon: "create-outline", color: "#3b82f6" },
  DELETE: { icon: "trash-outline", color: "#dc2626" },
  LOGIN: { icon: "log-in-outline", color: "#8b5cf6" },
  LOGOUT: { icon: "log-out-outline", color: "#6b7280" },
  INVITE: { icon: "mail-outline", color: "#d97706" },
  EXPORT: { icon: "download-outline", color: "#0891b2" },
  GRANT: { icon: "key-outline", color: "#16a34a" },
  REVOKE: { icon: "close-circle-outline", color: "#dc2626" },
};

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AuditScreen() {
  const { colors } = useTheme();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  // Filtre action
  const [filterAction, setFilterAction] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, logsData] = await Promise.all([
        auditApi.getStats(),
        auditApi.getOrganizationLogs({
          page,
          limit,
          action: filterAction || undefined,
        }),
      ]);
      setStats(statsData);
      setLogs(logsData.logs);
      setTotalPages(logsData.totalPages);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [page, filterAction]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const actions = stats ? Object.keys(stats.actionCounts) : [];

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.textSecondary, fontSize: 14 }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Toolbar: refresh */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginBottom: 12 }}>
          <TouchableOpacity onPress={loadData} style={{ padding: 8 }}>
            <Ionicons name="refresh-outline" size={20} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {error && (
          <View style={{ backgroundColor: "#fef2f2", borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <Text style={{ color: "#dc2626", fontSize: 14 }}>{error}</Text>
          </View>
        )}

        {/* Stats résumé */}
        {stats && (
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
            <View style={{ flex: 1, backgroundColor: "#eff6ff", borderRadius: 10, padding: 12, alignItems: "center" }}>
              <Text style={{ fontSize: 22, fontWeight: "800", color: "#3b82f6" }}>{stats.totalLogs}</Text>
              <Text style={{ fontSize: 11, color: "#3b82f6", fontWeight: "500" }}>Total</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: "#faf5ff", borderRadius: 10, padding: 12, alignItems: "center" }}>
              <Text style={{ fontSize: 22, fontWeight: "800", color: "#8b5cf6" }}>{stats.uniqueActors}</Text>
              <Text style={{ fontSize: 11, color: "#8b5cf6", fontWeight: "500" }}>Acteurs</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: "#f0fdf4", borderRadius: 10, padding: 12, alignItems: "center" }}>
              <Text style={{ fontSize: 14, fontWeight: "800", color: "#16a34a" }}>{ACTION_LABELS[stats.mostFrequentAction] || stats.mostFrequentAction}</Text>
              <Text style={{ fontSize: 11, color: "#16a34a", fontWeight: "500" }}>Top action</Text>
            </View>
          </View>
        )}

        {/* Filtres action */}
        {actions.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            <TouchableOpacity
              onPress={() => { setFilterAction(null); setPage(1); }}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 16,
                backgroundColor: !filterAction ? colors.primary : colors.border,
                marginRight: 8,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: !filterAction ? "#fff" : colors.text }}>Toutes</Text>
            </TouchableOpacity>
            {actions.map((action) => (
              <TouchableOpacity
                key={action}
                onPress={() => { setFilterAction(filterAction === action ? null : action); setPage(1); }}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor: filterAction === action ? colors.primary : colors.border,
                  marginRight: 8,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: "600", color: filterAction === action ? "#fff" : colors.text }}>
                  {ACTION_LABELS[action] || action}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Liste logs */}
        {logs.map((log) => {
          const actionInfo = ACTION_ICONS[log.action] || { icon: "ellipse-outline" as IoniconsName, color: "#6b7280" };
          const isExpanded = expandedId === log.id;

          return (
            <TouchableOpacity
              key={log.id}
              onPress={() => setExpandedId(isExpanded ? null : log.id)}
              activeOpacity={0.7}
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: 8,
                padding: 14,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${actionInfo.color}15`, justifyContent: "center", alignItems: "center", marginRight: 12 }}>
                  <Ionicons name={actionInfo.icon} size={18} color={actionInfo.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>
                      {ACTION_LABELS[log.action] || log.action}
                    </Text>
                    <View style={{ backgroundColor: colors.background, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 }}>
                      <Text style={{ fontSize: 10, fontWeight: "600", color: colors.textSecondary }}>{log.entityType}</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>{log.actorEmail}</Text>
                  <Text style={{ fontSize: 11, color: colors.disabled }}>{formatTimestamp(log.createdAt)}</Text>
                </View>
                <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={16} color={colors.textMuted} />
              </View>

              {isExpanded && log.changes && (
                <View style={{ marginTop: 10, backgroundColor: colors.background, borderRadius: 8, padding: 12, borderWidth: 1, borderColor: colors.border }}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: colors.textSecondary, marginBottom: 4 }}>Changements :</Text>
                  <Text style={{ fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", fontSize: 11, color: colors.text }}>
                    {JSON.stringify(log.changes, null, 2)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {logs.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Ionicons name="document-text-outline" size={40} color={colors.disabled} />
            <Text style={{ marginTop: 8, color: colors.textMuted, fontSize: 14 }}>Aucun log d'audit</Text>
          </View>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 16, gap: 12 }}>
            <TouchableOpacity
              onPress={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: page === 1 ? colors.border : colors.primary,
              }}
            >
              <Text style={{ color: page === 1 ? colors.textMuted : "#fff", fontWeight: "600", fontSize: 13 }}>Précédent</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>
              Page {page} / {totalPages}
            </Text>
            <TouchableOpacity
              onPress={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: page === totalPages ? colors.border : colors.primary,
              }}
            >
              <Text style={{ color: page === totalPages ? colors.textMuted : "#fff", fontWeight: "600", fontSize: 13 }}>Suivant</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
