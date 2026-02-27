import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { adminApi, AdminOrganization } from "@/lib/api/admin";

type PlanKey = "FREE" | "BASIQUE" | "PRO";

const PLAN_COLORS: Record<PlanKey, string> = {
  FREE: "#6b7280",
  BASIQUE: "#3b82f6",
  PRO: "#8b5cf6",
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "#16a34a",
  TRIALING: "#2563eb",
  EXPIRED: "#dc2626",
  CANCELLED: "#dc2626",
  PAST_DUE: "#d97706",
};

function formatDate(iso: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    ACTIVE: "Actif",
    TRIALING: "Essai",
    EXPIRED: "Expire",
    CANCELLED: "Annule",
    PAST_DUE: "Impaye",
  };
  return labels[status] || status;
}

export default function AdminScreen() {
  const [orgs, setOrgs] = useState<AdminOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadOrgs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getOrganizations();
      setOrgs(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      if (msg.includes("403") || msg.includes("refuse")) {
        setError("Acces refuse — droits administrateur requis");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadOrgs(); }, [loadOrgs]);

  const handleActivate = (org: AdminOrganization, plan: "BASIQUE" | "PRO") => {
    const n = org.memberCount;
    const unitPrice = plan === "BASIQUE" ? (n >= 2 ? 45000 : 50000) : (n >= 2 ? 65000 : 70000);
    const totalPrice = unitPrice * n;
    const confirmMsg = `Activer le plan ${plan} pour "${org.name}" ?\n${n} membre${n > 1 ? "s" : ""} x ${unitPrice.toLocaleString("fr-FR")} = ${totalPrice.toLocaleString("fr-FR")} XAF/an`;

    if (Platform.OS === "web") {
      if (!window.confirm(confirmMsg)) return;
      doActivate(org.id, plan);
    } else {
      Alert.alert("Confirmer l'activation", confirmMsg, [
        { text: "Annuler", style: "cancel" },
        { text: "Activer", onPress: () => doActivate(org.id, plan) },
      ]);
    }
  };

  const doActivate = async (orgId: string, plan: "BASIQUE" | "PRO") => {
    setActionLoading(orgId);
    try {
      await adminApi.activateSubscription(orgId, plan);
      await loadOrgs();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur";
      Alert.alert("Erreur", msg);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRenew = (org: AdminOrganization) => {
    const confirmMsg = `Renouveler l'abonnement de "${org.name}" pour 1 an ?`;

    if (Platform.OS === "web") {
      if (!window.confirm(confirmMsg)) return;
      doRenew(org.id);
    } else {
      Alert.alert("Confirmer le renouvellement", confirmMsg, [
        { text: "Annuler", style: "cancel" },
        { text: "Renouveler", onPress: () => doRenew(org.id) },
      ]);
    }
  };

  const doRenew = async (orgId: string) => {
    setActionLoading(orgId);
    try {
      await adminApi.renewSubscription(orgId);
      await loadOrgs();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur";
      Alert.alert("Erreur", msg);
    } finally {
      setActionLoading(null);
    }
  };

  // Stats
  const totalOrgs = orgs.length;
  const activeCount = orgs.filter(o => o.subscription?.status === "ACTIVE").length;
  const trialCount = orgs.filter(o => o.subscription?.status === "TRIALING").length;
  const expiredCount = orgs.filter(o => o.subscription?.status === "EXPIRED").length;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f9fafb" }}>
        <ActivityIndicator size="large" color="#00815d" />
        <Text style={{ marginTop: 12, color: "#6b7280", fontSize: 14 }}>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f9fafb", padding: 24 }}>
        <Ionicons name="shield-outline" size={48} color="#dc2626" />
        <Text style={{ marginTop: 12, color: "#dc2626", fontSize: 16, fontWeight: "600", textAlign: "center" }}>{error}</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20, paddingVertical: 10, paddingHorizontal: 24, backgroundColor: "#00815d", borderRadius: 8 }}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {/* Header */}
      <View style={{ backgroundColor: "#1a1a1a", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Administration</Text>
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Gestion des abonnements</Text>
            </View>
          </View>
          <TouchableOpacity onPress={loadOrgs} style={{ padding: 8 }}>
            <Ionicons name="refresh-outline" size={20} color="#00c17c" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Stats */}
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Total", value: totalOrgs, color: "#374151", bg: "#f3f4f6" },
            { label: "Actifs", value: activeCount, color: "#16a34a", bg: "#f0fdf4" },
            { label: "Essai", value: trialCount, color: "#2563eb", bg: "#eff6ff" },
            { label: "Expires", value: expiredCount, color: "#dc2626", bg: "#fef2f2" },
          ].map(s => (
            <View key={s.label} style={{ flex: 1, backgroundColor: s.bg, borderRadius: 10, padding: 12, alignItems: "center" }}>
              <Text style={{ fontSize: 22, fontWeight: "800", color: s.color }}>{s.value}</Text>
              <Text style={{ fontSize: 11, color: s.color, fontWeight: "500" }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Organisations */}
        {orgs.map(org => {
          const sub = org.subscription;
          const plan = (sub?.plan || "FREE") as PlanKey;
          const status = sub?.status || "EXPIRED";
          const planColor = PLAN_COLORS[plan] || "#6b7280";
          const statusColor = STATUS_COLORS[status] || "#6b7280";
          const quota = sub ? `${sub.questionsUsed} / ${sub.questionsPerMonth}` : "0 / 0";
          const quotaPercent = sub && sub.questionsPerMonth > 0 ? Math.min((sub.questionsUsed / sub.questionsPerMonth) * 100, 100) : 0;
          const isLoadingThis = actionLoading === org.id;

          return (
            <View
              key={org.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderLeftWidth: 4,
                borderLeftColor: planColor,
                marginBottom: 12,
                padding: 16,
              }}
            >
              {/* Entete org */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: "#1f2937" }}>{org.name}</Text>
                  <Text style={{ fontSize: 12, color: "#9ca3af" }}>{org.slug}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <View style={{ backgroundColor: `${planColor}20`, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                    <Text style={{ fontSize: 12, fontWeight: "700", color: planColor }}>{plan}</Text>
                  </View>
                  <View style={{ backgroundColor: `${statusColor}20`, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                    <Text style={{ fontSize: 12, fontWeight: "700", color: statusColor }}>{statusLabel(status)}</Text>
                  </View>
                </View>
              </View>

              {/* Quota */}
              <View style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={{ fontSize: 12, color: "#6b7280" }}>Questions (total org)</Text>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: "#374151" }}>{quota}</Text>
                </View>
                <View style={{ height: 6, backgroundColor: "#e5e7eb", borderRadius: 3 }}>
                  <View
                    style={{
                      height: 6,
                      width: `${quotaPercent}%` as `${number}%`,
                      backgroundColor: quotaPercent > 90 ? "#dc2626" : quotaPercent > 70 ? "#d97706" : "#16a34a",
                      borderRadius: 3,
                    }}
                  />
                </View>
              </View>

              {/* Infos */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
                <View>
                  <Text style={{ fontSize: 11, color: "#9ca3af" }}>Expire le</Text>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: "#374151" }}>{formatDate(sub?.currentPeriodEnd || null)}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 11, color: "#9ca3af" }}>Membres</Text>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: "#374151" }}>{org.memberCount}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 11, color: "#9ca3af" }}>Prix total/an</Text>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: "#374151" }}>{org.totalPrice > 0 ? `${org.totalPrice.toLocaleString("fr-FR")} XAF` : "-"}</Text>
                </View>
              </View>

              {/* Actions */}
              {isLoadingThis ? (
                <ActivityIndicator size="small" color="#00815d" />
              ) : (
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => handleActivate(org, "BASIQUE")}
                    style={{ flex: 1, backgroundColor: "#3b82f6", borderRadius: 8, paddingVertical: 10, alignItems: "center" }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>Basique</Text>
                    <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>{org.memberCount >= 2 ? "45 000" : "50 000"} /user</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleActivate(org, "PRO")}
                    style={{ flex: 1, backgroundColor: "#8b5cf6", borderRadius: 8, paddingVertical: 10, alignItems: "center" }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>Pro</Text>
                    <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>{org.memberCount >= 2 ? "65 000" : "70 000"} /user</Text>
                  </TouchableOpacity>
                  {(status === "ACTIVE" || status === "EXPIRED" || status === "TRIALING") && (
                    <TouchableOpacity
                      onPress={() => handleRenew(org)}
                      style={{ flex: 1, backgroundColor: "#00815d", borderRadius: 8, paddingVertical: 10, alignItems: "center" }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>Renouveler</Text>
                      <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>+1 an</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        })}

        {orgs.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Ionicons name="business-outline" size={40} color="#d1d5db" />
            <Text style={{ marginTop: 8, color: "#9ca3af", fontSize: 14 }}>Aucune organisation</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
