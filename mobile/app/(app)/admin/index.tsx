import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { adminApi, AdminOrganization } from "@/lib/api/admin";
import { useTheme } from "@/lib/theme/ThemeContext";
import AdminStatsGrid from "@/components/admin/AdminStatsGrid";
import OrganisationCard from "@/components/admin/OrganisationCard";

export default function AdminScreen() {
  const { colors } = useTheme();
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.textSecondary, fontSize: 14 }}>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background, padding: 24 }}>
        <Ionicons name="shield-outline" size={48} color="#dc2626" />
        <Text style={{ marginTop: 12, color: "#dc2626", fontSize: 16, fontWeight: "600", textAlign: "center" }}>{error}</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20, paddingVertical: 10, paddingHorizontal: 24, backgroundColor: colors.primary }}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Stats */}
        <AdminStatsGrid
          totalOrgs={totalOrgs}
          activeCount={activeCount}
          trialCount={trialCount}
          expiredCount={expiredCount}
          colors={colors}
        />

        {/* Organisations */}
        {orgs.map(org => (
          <OrganisationCard
            key={org.id}
            org={org}
            actionLoading={actionLoading}
            onActivate={handleActivate}
            onRenew={handleRenew}
            colors={colors}
          />
        ))}

        {orgs.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Ionicons name="business-outline" size={40} color={colors.disabled} />
            <Text style={{ marginTop: 8, color: colors.textMuted, fontSize: 14 }}>Aucune organisation</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
