import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  auditApi,
  type AuditLog,
  type AuditPaginatedResult,
  type AuditStats,
} from "@/lib/api/audit";
import { useAuthStore } from "@/lib/store/auth";
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
  const user = useAuthStore((s) => s.user);
  const isOwner = user?.role === "OWNER";

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Historique entité
  const [entityHistory, setEntityHistory] = useState<AuditLog[] | null>(null);
  const [entityHistoryLoading, setEntityHistoryLoading] = useState(false);
  const [showEntityHistory, setShowEntityHistory] = useState(false);

  // Nettoyage RGPD
  const [showCleanup, setShowCleanup] = useState(false);
  const [retentionDays, setRetentionDays] = useState("365");

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

  const handleEntityHistory = async (log: AuditLog) => {
    if (!log.entityType || !log.entityId) return;
    setEntityHistoryLoading(true);
    setShowEntityHistory(true);
    try {
      const result = await auditApi.getEntityHistory(log.entityType, log.entityId);
      setEntityHistory(result.logs);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur";
      Alert.alert("Erreur", msg);
      setShowEntityHistory(false);
    } finally {
      setEntityHistoryLoading(false);
    }
  };

  const handleCleanup = () => {
    const days = parseInt(retentionDays, 10);
    if (isNaN(days) || days < 1) {
      Alert.alert("Erreur", "Nombre de jours invalide");
      return;
    }
    const msg = `Supprimer les logs d'audit de plus de ${days} jours ? Cette action est irréversible.`;
    const doCleanup = async () => {
      setActionLoading(true);
      try {
        const result = await auditApi.cleanup(days);
        Alert.alert("Nettoyage terminé", `${result.deletedCount} log(s) supprimé(s).`);
        setShowCleanup(false);
        await loadData();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erreur";
        Alert.alert("Erreur", msg);
      } finally {
        setActionLoading(false);
      }
    };

    if (Platform.OS === "web") {
      if (!window.confirm(msg)) return;
      doCleanup();
    } else {
      Alert.alert("Nettoyage RGPD", msg, [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: doCleanup },
      ]);
    }
  };

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
        {/* Toolbar: refresh + cleanup */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginBottom: 12, gap: 8 }}>
          {isOwner && (
            <TouchableOpacity
              onPress={() => setShowCleanup(!showCleanup)}
              style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fef2f2", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
            >
              <Ionicons name="trash-outline" size={16} color="#dc2626" style={{ marginRight: 4 }} />
              <Text style={{ color: "#dc2626", fontSize: 13, fontWeight: "600" }}>Nettoyage RGPD</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={loadData} style={{ padding: 8 }}>
            <Ionicons name="refresh-outline" size={20} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Formulaire nettoyage RGPD */}
        {showCleanup && isOwner && (
          <View style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: "#fca5a5", padding: 16, marginBottom: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#dc2626", marginBottom: 8 }}>Nettoyage RGPD</Text>
            <Text style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 12 }}>
              Supprimer les logs plus anciens que le nombre de jours spécifié.
            </Text>
            <TextInput
              value={retentionDays}
              onChangeText={(v) => setRetentionDays(v.replace(/[^0-9]/g, ""))}
              placeholder="365"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              style={{
                backgroundColor: colors.background,
                borderRadius: 8,
                paddingHorizontal: 14,
                paddingVertical: 10,
                fontSize: 15,
                color: colors.text,
                marginBottom: 12,
              }}
            />
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                onPress={() => setShowCleanup(false)}
                style={{ flex: 1, backgroundColor: colors.background, borderRadius: 8, paddingVertical: 10, alignItems: "center" }}
              >
                <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14 }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCleanup}
                disabled={actionLoading}
                style={{ flex: 1, backgroundColor: "#dc2626", borderRadius: 8, paddingVertical: 10, alignItems: "center" }}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>Nettoyer</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

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

              {isExpanded && (
                <View style={{ marginTop: 10 }}>
                  {log.changes && (
                    <View style={{ backgroundColor: colors.background, borderRadius: 8, padding: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 8 }}>
                      <Text style={{ fontSize: 12, fontWeight: "600", color: colors.textSecondary, marginBottom: 4 }}>Changements :</Text>
                      <Text style={{ fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", fontSize: 11, color: colors.text }}>
                        {JSON.stringify(log.changes, null, 2)}
                      </Text>
                    </View>
                  )}
                  {log.entityType && log.entityId && (
                    <TouchableOpacity
                      onPress={() => handleEntityHistory(log)}
                      style={{ flexDirection: "row", alignItems: "center", paddingVertical: 6 }}
                    >
                      <Ionicons name="time-outline" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                      <Text style={{ fontSize: 13, color: colors.primary, fontWeight: "600" }}>Historique complet de cette entité</Text>
                    </TouchableOpacity>
                  )}
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

      {/* Modal historique entité */}
      {showEntityHistory && (
        <Modal
          visible={showEntityHistory}
          animationType="slide"
          transparent
          onRequestClose={() => { setShowEntityHistory(false); setEntityHistory(null); }}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
            <View style={{ backgroundColor: colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: "80%", padding: 20 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>Historique de l'entité</Text>
                <TouchableOpacity onPress={() => { setShowEntityHistory(false); setEntityHistory(null); }}>
                  <Ionicons name="close" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {entityHistoryLoading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 40 }} />
              ) : (
                <ScrollView style={{ maxHeight: 500 }}>
                  {entityHistory && entityHistory.length > 0 ? (
                    entityHistory.map((log) => {
                      const actionInfo = ACTION_ICONS[log.action] || { icon: "ellipse-outline" as IoniconsName, color: "#6b7280" };
                      return (
                        <View key={log.id} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                          <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${actionInfo.color}15`, justifyContent: "center", alignItems: "center", marginRight: 10 }}>
                            <Ionicons name={actionInfo.icon} size={16} color={actionInfo.color} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 13, fontWeight: "600", color: colors.text }}>{ACTION_LABELS[log.action] || log.action}</Text>
                            <Text style={{ fontSize: 11, color: colors.textMuted }}>{log.actorEmail} — {formatTimestamp(log.createdAt)}</Text>
                          </View>
                        </View>
                      );
                    })
                  ) : (
                    <Text style={{ color: colors.textMuted, textAlign: "center", paddingVertical: 20 }}>Aucun historique</Text>
                  )}
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
