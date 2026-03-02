import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { adminApi, AdminOrganization } from "@/lib/api/admin";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/ToastProvider";
import AdminStatsGrid from "@/components/admin/AdminStatsGrid";
import OrganisationCard from "@/components/admin/OrganisationCard";

export default function AdminScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { toast, confirm } = useToast();
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
      const msg = err instanceof Error ? err.message : t("security.unknownError");
      if (msg.includes("403") || msg.includes("refuse")) {
        setError(t("admin.accessDenied"));
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadOrgs(); }, [loadOrgs]);

  const handleActivate = async (org: AdminOrganization, plan: "BASIQUE" | "PRO") => {
    const n = org.memberCount;
    const unitPrice = plan === "BASIQUE"
      ? (n >= 10 ? 58500 : n >= 5 ? 63750 : n >= 3 ? 67500 : 75000)
      : (n >= 10 ? 92000 : n >= 5 ? 97750 : n >= 3 ? 103500 : 115000);
    const totalPrice = unitPrice * n;
    const confirmMsg = `${n} membre${n > 1 ? "s" : ""} x ${unitPrice.toLocaleString("fr-FR")} = ${totalPrice.toLocaleString("fr-FR")} XAF/an`;

    const ok = await confirm({
      title: `Activer le plan ${plan} pour "${org.name}" ?`,
      message: confirmMsg,
      confirmLabel: t("security.activate"),
      cancelLabel: t("common.cancel"),
    });
    if (!ok) return;
    doActivate(org.id, plan);
  };

  const doActivate = async (orgId: string, plan: "BASIQUE" | "PRO") => {
    setActionLoading(orgId);
    try {
      await adminApi.activateSubscription(orgId, plan);
      toast(t("security.activate") + " — OK", "success");
      await loadOrgs();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("common.error");
      toast(msg, "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRenew = async (org: AdminOrganization) => {
    const ok = await confirm({
      title: t("admin.confirmRenewal"),
      message: `Renouveler l'abonnement de "${org.name}" pour 1 an ?`,
      confirmLabel: t("admin.renew"),
      cancelLabel: t("common.cancel"),
    });
    if (!ok) return;
    doRenew(org.id);
  };

  const doRenew = async (orgId: string) => {
    setActionLoading(orgId);
    try {
      await adminApi.renewSubscription(orgId);
      toast("Abonnement renouvelé", "success");
      await loadOrgs();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("common.error");
      toast(msg, "error");
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
        <Text style={{ marginTop: 12, color: colors.textSecondary, fontSize: 14 }}>{t("common.loading")}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background, padding: 24 }}>
        <Ionicons name="shield-outline" size={48} color={colors.danger} />
        <Text style={{ marginTop: 12, color: colors.danger, fontSize: 16, fontWeight: "600", textAlign: "center" }}>{error}</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20, paddingVertical: 10, paddingHorizontal: 24, backgroundColor: colors.primary }}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>{t("common.back")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <AdminStatsGrid
          totalOrgs={totalOrgs}
          activeCount={activeCount}
          trialCount={trialCount}
          expiredCount={expiredCount}
          colors={colors}
        />

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
            <Text style={{ marginTop: 8, color: colors.textMuted, fontSize: 14 }}>{t("admin.noOrganizations")}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
