import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";
import { fonts, fontWeights } from "@/lib/theme/fonts";

type Props = {
  favoritesCount?: number;
};

const MOIS: Record<string, number> = {
  jan: 0, "fev": 1, "fév": 1, mars: 2, avr: 3, mai: 4, juin: 5,
  juil: 6, "aout": 7, "août": 7, sept: 8, oct: 9, nov: 10, "dec": 11, "déc": 11,
};

function trierEcheances(echeances: { date: string; label: string; icon: keyof typeof Ionicons.glyphMap }[]) {
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

function getGreeting(t: (key: string) => string) {
  const h = new Date().getHours();
  if (h < 12) return t("dashboard.greeting.morning");
  if (h < 18) return t("dashboard.greeting.afternoon");
  return t("dashboard.greeting.evening");
}

const STATS = [
  { labelKey: "dashboard.stats.articles", value: "2 248", icon: "document-text-outline" as const, color: "#00815d" },
  { labelKey: "dashboard.stats.simulators", value: "14", icon: "calculator-outline" as const, color: "#4f46e5" },
  { labelKey: "dashboard.stats.tfnc", value: "64", icon: "library-outline" as const, color: "#d97706" },
  { labelKey: "dashboard.stats.edition", value: "2026", icon: "calendar-outline" as const, color: "#9333ea" },
];

const ACTIONS = [
  { titleKey: "dashboard.actions.consultCgi", descKey: "dashboard.actions.consultCgiDesc", icon: "book-outline" as const, route: "/(app)/code" },
  { titleKey: "dashboard.actions.chatAi", descKey: "dashboard.actions.chatAiDesc", icon: "chatbubbles-outline" as const, route: "/(app)/chat" },
  { titleKey: "dashboard.actions.simulate", descKey: "dashboard.actions.simulateDesc", icon: "stats-chart-outline" as const, route: "/(app)/simulateur" },
  { titleKey: "dashboard.actions.settings", descKey: "dashboard.actions.settingsDesc", icon: "settings-outline" as const, route: "/(app)/parametres" },
];

export default function HomeCards({ favoritesCount: _fc }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const cardBase = {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
  };

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

  const prochaines3 = useMemo(() => trierEcheances(ECHEANCES).slice(0, 3), [ECHEANCES]);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 18, paddingBottom: 30 }}>
      {/* En-tête — Greeting + CGI 242 */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 15, color: colors.textSecondary, marginBottom: 4 }}>
          {getGreeting(t)}
        </Text>
        <Text style={{ fontFamily: fonts.extraBold, fontWeight: fontWeights.extraBold, fontSize: 24, color: colors.text, letterSpacing: -0.5 }}>
          CGI <Text style={{ color: colors.primary }}>242</Text>
        </Text>
        <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 12, color: colors.textMuted, marginTop: 4 }}>
          {t("dashboard.subtitle")}
        </Text>
      </View>

      {/* Stats — 4 mini-cards en ligne */}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 22 }}>
        {STATS.map((s) => (
          <View
            key={s.labelKey}
            style={{
              flex: 1,
              ...cardBase,
              alignItems: "center",
              paddingVertical: 12,
              paddingHorizontal: 6,
            }}
          >
            <Ionicons name={s.icon} size={18} color={s.color} style={{ marginBottom: 4 }} />
            <Text style={{ fontFamily: fonts.extraBold, fontWeight: fontWeights.extraBold, fontSize: 16, color: colors.text }}>
              {s.value}
            </Text>
            <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 9, color: colors.textMuted, textAlign: "center" }} numberOfLines={1}>
              {t(s.labelKey)}
            </Text>
          </View>
        ))}
      </View>

      {/* Actions rapides — grille 2x2 */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        {ACTIONS.map((item) => (
          <TouchableOpacity
            key={item.titleKey}
            onPress={() => router.push(item.route as Href)}
            style={{
              ...cardBase,
              flex: 1,
              minWidth: "45%",
              alignItems: "center",
              paddingVertical: 22,
              paddingHorizontal: 14,
            }}
          >
            <Ionicons name={item.icon} size={28} color={colors.primary} style={{ marginBottom: 8 }} />
            <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 14, color: colors.text, marginBottom: 3, textAlign: "center" }}>
              {t(item.titleKey)}
            </Text>
            <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 11, color: colors.textMuted, textAlign: "center" }}>
              {t(item.descKey)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Echéances fiscales */}
      <View style={{ marginBottom: 22 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="calendar-outline" size={16} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 14, color: colors.text }}>
              {t("dashboard.fiscalDeadlines")}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/(app)/calendrier" as Href)}>
            <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 12, color: colors.primary }}>
              {t("dashboard.seeAll")}
            </Text>
          </TouchableOpacity>
        </View>
        {prochaines3.map((e, i) => (
          <View
            key={`${e.date}-${e.label}`}
            style={{
              ...cardBase,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              padding: 14,
              marginBottom: i < 2 ? 10 : 0,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: `${colors.primary}20`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name={e.icon} size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 13, color: colors.text }} numberOfLines={1}>
                {e.label}
              </Text>
              <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 11, color: colors.textMuted }}>
                {e.date === "15/mois" ? "15 du mois" : e.date}
              </Text>
            </View>
            {i === 0 && (
              <View style={{ backgroundColor: "#ef4444", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 10, color: "#fff" }}>
                  {t("common.urgent")}
                </Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </View>
        ))}
      </View>

      {/* Astuce du jour */}
      <View
        style={{
          ...cardBase,
          backgroundColor: `${colors.primary}10`,
          borderColor: `${colors.primary}25`,
          padding: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
          <Ionicons name="bulb-outline" size={18} color={colors.primary} style={{ marginRight: 6 }} />
          <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 13, color: colors.primary }}>
            {t("dashboard.tip.title")}
          </Text>
        </View>
        <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 12, color: colors.textSecondary, lineHeight: 18 }}>
          {t("dashboard.tip.text")}
        </Text>
      </View>
    </ScrollView>
  );
}
