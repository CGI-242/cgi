import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { subscriptionApi, type QuotaResponse } from "@/lib/api/subscription";
import { useAuthStore } from "@/lib/store/auth";
import { useTheme } from "@/lib/theme/ThemeContext";
import PlanHeader, { PLAN_COLORS, STATUS_COLORS } from "@/components/abonnement/PlanHeader";
import QuotaProgress from "@/components/abonnement/QuotaProgress";
import PeriodInfo from "@/components/abonnement/PeriodInfo";
import PlansComparison from "@/components/abonnement/PlansComparison";
import SubscriptionActions from "@/components/abonnement/SubscriptionActions";

export default function AbonnementScreen() {
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const [quota, setQuota] = useState<QuotaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwner = user?.role === "OWNER";

  const loadQuota = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await subscriptionApi.getQuota();
      setQuota(data);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      const errorMsg =
        axiosErr?.response?.data?.error || "Impossible de charger les informations d'abonnement";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuota();
  }, [loadQuota]);

  const confirmAction = (message: string, action: () => Promise<void>) => {
    if (Platform.OS === "web") {
      if (!window.confirm(message)) return;
      action();
    } else {
      Alert.alert("Confirmer", message, [
        { text: "Annuler", style: "cancel" },
        { text: "Confirmer", onPress: () => action() },
      ]);
    }
  };

  const handleActivate = (planName: string) => {
    confirmAction(`Activer le plan ${planName} ?`, async () => {
      setActionLoading(true);
      try {
        await subscriptionApi.activate(planName);
        await loadQuota();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erreur";
        Alert.alert("Erreur", msg);
      } finally {
        setActionLoading(false);
      }
    });
  };

  const handleRenew = () => {
    confirmAction("Renouveler votre abonnement ?", async () => {
      setActionLoading(true);
      try {
        await subscriptionApi.renew();
        await loadQuota();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erreur";
        Alert.alert("Erreur", msg);
      } finally {
        setActionLoading(false);
      }
    });
  };

  const handleUpgrade = () => {
    confirmAction("Passer au plan PRO ?", async () => {
      setActionLoading(true);
      try {
        await subscriptionApi.upgrade("PRO");
        await loadQuota();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erreur";
        Alert.alert("Erreur", msg);
      } finally {
        setActionLoading(false);
      }
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textSecondary, fontSize: 14, marginTop: 12 }}>
          Chargement de l'abonnement...
        </Text>
      </View>
    );
  }

  const plan = quota?.plan?.toUpperCase() || "FREE";
  const status = quota?.status?.toUpperCase() || "EXPIRED";
  const planColor = PLAN_COLORS[plan] || PLAN_COLORS.FREE;
  const statusColor = STATUS_COLORS[status] || STATUS_COLORS.EXPIRED;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {error && (
          <View
            style={{
              backgroundColor: "#fee2e2",
              padding: 12,
              marginBottom: 16,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="alert-circle" size={20} color="#dc2626" style={{ marginRight: 8 }} />
            <Text style={{ color: "#dc2626", fontSize: 14, flex: 1 }}>{error}</Text>
            <TouchableOpacity onPress={loadQuota}>
              <Text style={{ color: "#dc2626", fontWeight: "700", fontSize: 13 }}>Reessayer</Text>
            </TouchableOpacity>
          </View>
        )}

        <PlanHeader plan={plan} status={status} colors={colors} />

        <QuotaProgress
          questionsUsed={quota?.questionsUsed ?? 0}
          questionsLimit={quota?.questionsPerMonth ?? 0}
          isUnlimited={quota?.isUnlimited ?? false}
          remaining={quota?.remaining ?? 0}
          planColor={planColor}
          colors={colors}
        />

        <PeriodInfo
          status={status}
          statusColor={statusColor}
          currentPeriodStart={quota?.currentPeriodStart}
          currentPeriodEnd={quota?.currentPeriodEnd}
          colors={colors}
        />

        <PlansComparison currentPlan={plan} colors={colors} />

        {isOwner && (
          <SubscriptionActions
            plan={plan}
            status={status}
            actionLoading={actionLoading}
            onActivate={handleActivate}
            onRenew={handleRenew}
            onUpgrade={handleUpgrade}
            colors={colors}
          />
        )}

        {/* Footer CTA */}
        <View
          style={{
            backgroundColor: colors.card,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: "center",
          }}
        >
          <Ionicons name="call-outline" size={28} color={colors.primary} style={{ marginBottom: 8 }} />
          <Text style={{ fontSize: 15, fontWeight: "700", color: colors.text, textAlign: "center", marginBottom: 4 }}>
            Pour souscrire ou renouveler
          </Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, textAlign: "center", marginBottom: 12 }}>
            L'activation des abonnements se fait manuellement. Contactez notre equipe pour toute demande.
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL("mailto:contact@cgi242.com")}
            accessibilityLabel="Contacter pour souscrire"
            accessibilityRole="button"
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 12,
              paddingHorizontal: 24,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="mail" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>contact@cgi242.com</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text style={{ fontSize: 12, color: colors.textMuted }}>CGI242 v1.0.0 -- Edition 2026</Text>
          <Text style={{ fontSize: 11, color: colors.disabled, marginTop: 1 }}>NormX AI</Text>
        </View>
      </ScrollView>
    </View>
  );
}
