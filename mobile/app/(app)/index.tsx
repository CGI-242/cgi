import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useMemo } from "react";
import { router } from "expo-router";
import { useAuthStore } from "@/lib/store/auth";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";

function getGreeting(t: (key: string) => string) {
  const h = new Date().getHours();
  if (h < 12) return `☀️ ${t("dashboard.greeting.morning")}`;
  if (h < 18) return `🌅 ${t("dashboard.greeting.afternoon")}`;
  return `🌙 ${t("dashboard.greeting.evening")}`;
}

const STATS = [
  { labelKey: "dashboard.stats.articles", value: "7 000+", icon: "document-text-outline" as const, bg: "#e6f7f0", color: "#00815d" },
  { labelKey: "dashboard.stats.simulators", value: "4", icon: "calculator-outline" as const, bg: "#eef2ff", color: "#4f46e5" },
  { labelKey: "dashboard.stats.tfnc", value: "60+", icon: "library-outline" as const, bg: "#fef3c7", color: "#d97706" },
  { labelKey: "dashboard.stats.edition", value: "2026", icon: "calendar-outline" as const, bg: "#f3e8ff", color: "#9333ea" },
];

const MOIS: Record<string, number> = {
  jan: 0, "fev": 1, "fév": 1, mars: 2, avr: 3, mai: 4, juin: 5,
  juil: 6, "aout": 7, "août": 7, sept: 8, oct: 9, nov: 10, "dec": 11, "déc": 11,
};

function trierEcheances(echeances: { date: string; label: string; icon: any }[]) {
  const now = new Date();
  const mois = now.getMonth();
  const jour = now.getDate();

  function joursAvant(dateStr: string): number {
    if (dateStr === "15/mois") {
      return jour <= 15 ? 15 - jour : 30 - jour + 15;
    }
    const m = dateStr.match(/(\d+)\s+(\w+)/);
    if (!m) return 999;
    const d = parseInt(m[1]);
    const mo = MOIS[m[2].replace(".", "")];
    if (mo === undefined) return 999;
    if (mo > mois || (mo === mois && d >= jour)) {
      return (mo - mois) * 30 + (d - jour);
    }
    return (mo + 12 - mois) * 30 + (d - jour);
  }

  return [...echeances].sort((a, b) => joursAvant(a.date) - joursAvant(b.date));
}

export default function Dashboard() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { colors } = useTheme();

  const ECHEANCES = useMemo(() => [
    { date: "15 mars", label: t("dashboard.deadlines.minPerceptionT1"), icon: "business-outline" as const },
    { date: "15 juin", label: t("dashboard.deadlines.minPerceptionT2"), icon: "business-outline" as const },
    { date: "15 sept.", label: t("dashboard.deadlines.minPerceptionT3"), icon: "business-outline" as const },
    { date: "15 déc.", label: t("dashboard.deadlines.minPerceptionT4"), icon: "business-outline" as const },
    { date: "15/mois", label: t("dashboard.deadlines.tva"), icon: "receipt-outline" as const },
    { date: "15/mois", label: t("dashboard.deadlines.its"), icon: "people-outline" as const },
    { date: "15 avr.", label: t("dashboard.deadlines.patente"), icon: "storefront-outline" as const },
    { date: "15 mars", label: t("dashboard.deadlines.irpp"), icon: "person-outline" as const },
    { date: "15 mai", label: t("dashboard.deadlines.irf1"), icon: "home-outline" as const },
    { date: "20 août", label: t("dashboard.deadlines.irf2"), icon: "home-outline" as const },
    { date: "15 nov.", label: t("dashboard.deadlines.irf3"), icon: "home-outline" as const },
  ], [t]);

  const QUICK_ACTIONS = useMemo(() => [
    {
      label: t("dashboard.actions.consultCgi"),
      desc: t("dashboard.actions.consultCgiDesc"),
      icon: "book-outline" as const,
      bg: "#e6f7f0",
      color: "#00815d",
      route: "/(app)/code",
    },
    {
      label: t("dashboard.actions.simulate"),
      desc: t("dashboard.actions.simulateDesc"),
      icon: "calculator-outline" as const,
      bg: "#eef2ff",
      color: "#4f46e5",
      route: "/(app)/simulateur",
    },
    {
      label: t("dashboard.actions.chatAi"),
      desc: t("dashboard.actions.chatAiDesc"),
      icon: "chatbubbles-outline" as const,
      bg: "#e0f2fe",
      color: "#0284c7",
      route: "/(app)/chat",
    },
  ], [t]);

  const echeancesTriees = useMemo(() => trierEcheances(ECHEANCES), [ECHEANCES]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Bienvenue */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
          <Text style={{ fontSize: 22, fontWeight: "800", color: colors.text }}>
            {getGreeting(t)}, {user?.prenom || t("dashboard.user")} !
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 2 }}>
            {t("dashboard.subtitle")}
          </Text>
        </View>

        {/* Stats cards — grille 2x2 */}
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {STATS.map((s) => (
              <View
                key={s.labelKey}
                style={{
                  flex: 1,
                  minWidth: "45%",
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: 14,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: s.bg,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons name={s.icon} size={22} color={s.color} />
                </View>
                <View>
                  <Text style={{ fontSize: 20, fontWeight: "800", color: colors.text }}>{s.value}</Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>{t(s.labelKey)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Actions rapides */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 10 }}>{t("dashboard.quickActions")}</Text>
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              overflow: "hidden",
            }}
          >
            {QUICK_ACTIONS.map((a, i) => {
              const disabled = !a.route;
              return (
                <TouchableOpacity
                  key={a.label}
                  onPress={() => a.route && router.push(a.route as any)}
                  disabled={disabled}
                  accessibilityLabel={a.label}
                  accessibilityRole="button"
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 14,
                    paddingVertical: 14,
                    borderBottomWidth: i < QUICK_ACTIONS.length - 1 ? 1 : 0,
                    borderBottomColor: colors.background,
                    opacity: disabled ? 0.5 : 1,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: a.bg,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <Ionicons name={a.icon} size={20} color={a.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: "700", color: disabled ? colors.textMuted : colors.text }}>
                      {a.label}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textMuted }}>{a.desc}</Text>
                  </View>
                  {disabled ? (
                    <View style={{ backgroundColor: colors.background, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
                      <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textMuted }}>{t("common.comingSoon")}</Text>
                    </View>
                  ) : (
                    <Ionicons name="chevron-forward" size={18} color={colors.disabled} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Echeances fiscales */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <Ionicons name="calendar-outline" size={15} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>{t("dashboard.fiscalDeadlines")}</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {echeancesTriees.map((e) => (
              <View
                key={`${e.date}-${e.label}`}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: colors.border,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  minWidth: 140,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                  <Ionicons name={e.icon} size={13} color={colors.primary} style={{ marginRight: 5 }} />
                  <Text style={{ fontSize: 14, fontWeight: "700", color: colors.primary }}>{e.date}</Text>
                </View>
                <Text style={{ fontSize: 13, color: colors.text }}>{e.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Footer */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 12, color: colors.textMuted }}>{t("dashboard.footer")}</Text>
          <Text style={{ fontSize: 11, color: colors.disabled, marginTop: 1 }}>NormX AI</Text>
        </View>
      </ScrollView>
    </View>
  );
}
