import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Linking,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { subscriptionApi, type QuotaResponse } from "@/lib/api/subscription";

// -- Couleurs par plan --
const PLAN_COLORS: Record<string, string> = {
  FREE: "#6b7280",
  BASIQUE: "#3b82f6",
  PRO: "#8b5cf6",
};

const PLAN_BG: Record<string, string> = {
  FREE: "#f3f4f6",
  BASIQUE: "#eff6ff",
  PRO: "#f5f3ff",
};

// -- Couleurs par statut --
const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "#059669",
  TRIALING: "#d97706",
  EXPIRED: "#dc2626",
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Actif",
  TRIALING: "Essai",
  EXPIRED: "Expire",
};

// -- Informations plans (tarification annuelle par user) --
const PLANS_INFO = [
  {
    name: "FREE",
    price: "Gratuit",
    priceDetail: "7 jours d'essai",
    features: [
      "5 questions IA / mois",
      "Acces au CGI en lecture",
      "Simulateurs de base",
    ],
  },
  {
    name: "BASIQUE",
    price: "50 000 XAF / an",
    priceDetail: "45 000 XAF/an/user a partir de 2 users",
    features: [
      "20 questions IA / mois / user",
      "Acces complet au CGI",
      "Tous les simulateurs",
      "Historique des conversations",
      "Jusqu'a 50 membres",
    ],
  },
  {
    name: "PRO",
    price: "70 000 XAF / an",
    priceDetail: "65 000 XAF/an/user a partir de 2 users",
    features: [
      "50 questions IA / mois / user",
      "Acces complet au CGI",
      "Tous les simulateurs",
      "Historique illimite",
      "Support prioritaire",
      "Jusqu'a 50 membres",
    ],
  },
];

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function daysRemaining(dateStr?: string | null): number | null {
  if (!dateStr) return null;
  const end = new Date(dateStr);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function AbonnementScreen() {
  const [quota, setQuota] = useState<QuotaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#f3f4f6", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00815d" />
        <Text style={{ color: "#6b7280", fontSize: 14, marginTop: 12 }}>
          Chargement de l'abonnement...
        </Text>
      </View>
    );
  }

  const plan = quota?.plan?.toUpperCase() || "FREE";
  const status = quota?.status?.toUpperCase() || "EXPIRED";
  const planColor = PLAN_COLORS[plan] || PLAN_COLORS.FREE;
  const planBg = PLAN_BG[plan] || PLAN_BG.FREE;
  const statusColor = STATUS_COLORS[status] || STATUS_COLORS.EXPIRED;
  const statusLabel = STATUS_LABELS[status] || status;

  const questionsUsed = quota?.questionsUsed ?? 0;
  const questionsLimit = quota?.questionsPerMonth ?? 0;
  const isUnlimited = quota?.isUnlimited ?? false;
  const progressRatio =
    isUnlimited || questionsLimit === 0
      ? 0
      : Math.min(questionsUsed / questionsLimit, 1);

  const days = daysRemaining(quota?.currentPeriodEnd);
  const expirationLabel =
    status === "TRIALING"
      ? "Essai expire le"
      : status === "EXPIRED"
        ? "Expire depuis le"
        : "Renouvellement le";

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#1a1a1a",
          paddingTop: Platform.OS === "ios" ? 56 : 16,
          paddingBottom: 16,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", flex: 1 }}>
          Mon abonnement
        </Text>
        <TouchableOpacity onPress={loadQuota} accessibilityLabel="Actualiser" accessibilityRole="button">
          <Ionicons name="refresh-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Erreur */}
        {error && (
          <View
            style={{
              backgroundColor: "#fee2e2",
              borderRadius: 8,
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

        {/* Plan Card */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            borderWidth: 2,
            borderColor: planColor,
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          {/* Plan header band */}
          <View
            style={{
              backgroundColor: planBg,
              paddingVertical: 20,
              paddingHorizontal: 20,
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: planColor,
                paddingHorizontal: 20,
                paddingVertical: 6,
                borderRadius: 20,
                marginBottom: 8,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "900", letterSpacing: 1 }}>
                {plan}
              </Text>
            </View>

            {/* Status badge */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#fff",
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: statusColor,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: statusColor,
                  marginRight: 6,
                }}
              />
              <Text style={{ color: statusColor, fontSize: 13, fontWeight: "700" }}>
                {statusLabel}
              </Text>
            </View>
          </View>

          {/* Plan price */}
          <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, alignItems: "center" }}>
            <Text style={{ fontSize: 22, fontWeight: "800", color: "#1f2937" }}>
              {PLANS_INFO.find((p) => p.name === plan)?.price || "Gratuit"}
            </Text>
          </View>
        </View>

        {/* Quota Section */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#e5e7eb",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#00815d" style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#1f2937" }}>Quota de questions</Text>
          </View>

          {isUnlimited ? (
            <View style={{ alignItems: "center", paddingVertical: 8 }}>
              <Ionicons name="infinite-outline" size={36} color="#8b5cf6" />
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#8b5cf6", marginTop: 4 }}>
                Illimite
              </Text>
              <Text style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
                {questionsUsed} questions posees ce mois
              </Text>
            </View>
          ) : (
            <>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ fontSize: 14, color: "#374151" }}>
                  {questionsUsed} / {questionsLimit} questions utilisees ce mois
                </Text>
                <Text style={{ fontSize: 14, fontWeight: "700", color: planColor }}>
                  {quota?.remaining ?? 0} restantes
                </Text>
              </View>

              {/* Progress bar */}
              <View
                style={{
                  height: 10,
                  backgroundColor: "#e5e7eb",
                  borderRadius: 5,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${Math.round(progressRatio * 100)}%`,
                    backgroundColor:
                      progressRatio >= 0.9
                        ? "#dc2626"
                        : progressRatio >= 0.7
                          ? "#d97706"
                          : "#00c17c",
                    borderRadius: 5,
                  }}
                />
              </View>

              {progressRatio >= 0.9 && (
                <Text style={{ fontSize: 12, color: "#dc2626", marginTop: 6, fontWeight: "600" }}>
                  Attention : vous approchez de la limite mensuelle
                </Text>
              )}
            </>
          )}
        </View>

        {/* Expiration Section */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#e5e7eb",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <Ionicons name="calendar-outline" size={20} color="#00815d" style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#1f2937" }}>Periode</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ fontSize: 13, color: "#6b7280" }}>Debut de periode</Text>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151" }}>
              {formatDate(quota?.currentPeriodStart)}
            </Text>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: "#f3f4f6",
              marginVertical: 8,
            }}
          />

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ fontSize: 13, color: "#6b7280" }}>{expirationLabel}</Text>
            <Text style={{ fontSize: 14, fontWeight: "600", color: statusColor }}>
              {formatDate(quota?.currentPeriodEnd)}
            </Text>
          </View>

          {days !== null && status !== "EXPIRED" && (
            <>
              <View
                style={{
                  height: 1,
                  backgroundColor: "#f3f4f6",
                  marginVertical: 8,
                }}
              />
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 13, color: "#6b7280" }}>Jours restants</Text>
                <View
                  style={{
                    backgroundColor: days <= 5 ? "#fee2e2" : days <= 10 ? "#fef3c7" : "#d1fae5",
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "800",
                      color: days <= 5 ? "#dc2626" : days <= 10 ? "#d97706" : "#059669",
                    }}
                  >
                    {days} jour{days !== 1 ? "s" : ""}
                  </Text>
                </View>
              </View>
            </>
          )}

          {status === "EXPIRED" && (
            <View
              style={{
                backgroundColor: "#fee2e2",
                borderRadius: 8,
                padding: 10,
                marginTop: 8,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons name="warning-outline" size={18} color="#dc2626" style={{ marginRight: 8 }} />
              <Text style={{ color: "#dc2626", fontSize: 13, fontWeight: "600", flex: 1 }}>
                Votre abonnement a expire. Contactez-nous pour le renouveler.
              </Text>
            </View>
          )}
        </View>

        {/* Plans Comparison */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <Ionicons name="layers-outline" size={20} color="#00815d" style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#1f2937" }}>Nos offres</Text>
          </View>

          {PLANS_INFO.map((planInfo) => {
            const isCurrentPlan = planInfo.name === plan;
            const color = PLAN_COLORS[planInfo.name];
            const bg = PLAN_BG[planInfo.name];

            return (
              <View
                key={planInfo.name}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 10,
                  borderWidth: isCurrentPlan ? 2 : 1,
                  borderColor: isCurrentPlan ? color : "#e5e7eb",
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        backgroundColor: color,
                        paddingHorizontal: 10,
                        paddingVertical: 3,
                        borderRadius: 6,
                        marginRight: 8,
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 12, fontWeight: "800" }}>
                        {planInfo.name}
                      </Text>
                    </View>
                    {isCurrentPlan && (
                      <View
                        style={{
                          backgroundColor: bg,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 4,
                        }}
                      >
                        <Text style={{ color, fontSize: 11, fontWeight: "700" }}>Plan actuel</Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: "800", color: "#1f2937" }}>
                    {planInfo.price}
                  </Text>
                </View>

                {planInfo.priceDetail && (
                  <Text style={{ fontSize: 11, color: "#6b7280", marginBottom: 8, fontStyle: "italic" }}>
                    {planInfo.priceDetail}
                  </Text>
                )}

                {planInfo.features.map((feature, idx) => (
                  <View
                    key={idx}
                    style={{ flexDirection: "row", alignItems: "center", marginBottom: idx < planInfo.features.length - 1 ? 6 : 0 }}
                  >
                    <Ionicons name="checkmark-circle" size={16} color={color} style={{ marginRight: 8 }} />
                    <Text style={{ fontSize: 13, color: "#374151" }}>{feature}</Text>
                  </View>
                ))}
              </View>
            );
          })}
        </View>

        {/* Footer CTA */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            alignItems: "center",
          }}
        >
          <Ionicons name="call-outline" size={28} color="#00815d" style={{ marginBottom: 8 }} />
          <Text style={{ fontSize: 15, fontWeight: "700", color: "#1f2937", textAlign: "center", marginBottom: 4 }}>
            Pour souscrire ou renouveler
          </Text>
          <Text style={{ fontSize: 13, color: "#6b7280", textAlign: "center", marginBottom: 12 }}>
            L'activation des abonnements se fait manuellement. Contactez notre equipe pour toute demande.
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL("mailto:contact@cgi242.com")}
            accessibilityLabel="Contacter pour souscrire"
            accessibilityRole="button"
            style={{
              backgroundColor: "#00815d",
              borderRadius: 10,
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

        {/* Bottom spacing text */}
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text style={{ fontSize: 12, color: "#9ca3af" }}>CGI242 v1.0.0 -- Edition 2026</Text>
          <Text style={{ fontSize: 11, color: "#d1d5db", marginTop: 1 }}>NormX AI</Text>
        </View>
      </ScrollView>
    </View>
  );
}
