import { View, Text, TouchableOpacity, ScrollView, Linking, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";

const PLANS = [
  { key: "free", questionsKey: "5", priceLabel: "0 XAF", expired: true },
  { key: "basic", questionsKey: "50", priceLabel: "50 000 XAF" },
  { key: "pro", questionsKey: "unlimited", priceLabel: "70 000 XAF" },
];

export default function PaywallScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const logout = useAuthStore((s) => s.logout);

  const handleContact = () => {
    Linking.openURL("mailto:contact@cgi242.com?subject=Souscription%20CGI242");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Icône cadenas */}
        <View style={[styles.iconCircle, { backgroundColor: colors.primary + "20" }]}>
          <Ionicons name="lock-closed" size={48} color={colors.primary} />
        </View>

        {/* Titre */}
        <Text style={[styles.title, { color: colors.text }]}>
          {t("paywall.title")}
        </Text>

        {/* Sous-titre */}
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t("paywall.subtitle")}
        </Text>

        {/* Tableau comparatif */}
        <View style={[styles.table, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* En-tête */}
          <View style={[styles.tableRow, styles.tableHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.cellHeader, styles.cellPlan, { color: colors.textSecondary }]}>
              {t("paywall.plan")}
            </Text>
            <Text style={[styles.cellHeader, styles.cellPrice, { color: colors.textSecondary }]}>
              {t("paywall.price")}
            </Text>
            <Text style={[styles.cellHeader, styles.cellQuestions, { color: colors.textSecondary }]}>
              {t("paywall.questions")}
            </Text>
          </View>

          {/* Lignes */}
          {PLANS.map((plan, i) => (
            <View
              key={plan.key}
              style={[
                styles.tableRow,
                i < PLANS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                plan.expired && { opacity: 0.5 },
              ]}
            >
              <View style={styles.cellPlan}>
                <Text style={[styles.cellText, { color: colors.text, fontWeight: "700" }]}>
                  {t(`paywall.${plan.key}`)}
                </Text>
                {plan.expired && (
                  <Text style={[styles.expiredBadge, { color: colors.danger }]}>
                    {t("paywall.expired")}
                  </Text>
                )}
              </View>
              <Text style={[styles.cellText, styles.cellPrice, { color: colors.text }]}>
                {plan.priceLabel}
                {!plan.expired && plan.key !== "free" ? t("paywall.perYear") : ""}
              </Text>
              <Text style={[styles.cellText, styles.cellQuestions, { color: colors.text }]}>
                {plan.questionsKey === "unlimited" ? t("paywall.unlimited") : plan.questionsKey}
              </Text>
            </View>
          ))}
        </View>

        {/* Description contact */}
        <Text style={[styles.contactDesc, { color: colors.textSecondary }]}>
          {t("paywall.contactDesc")}
        </Text>

        {/* Bouton CTA */}
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: colors.primary }]}
          onPress={handleContact}
          activeOpacity={0.8}
        >
          <Ionicons name="mail-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.ctaText}>{t("paywall.contactCta")}</Text>
        </TouchableOpacity>

        {/* Bouton déconnexion */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.textSecondary} style={{ marginRight: 6 }} />
          <Text style={[styles.logoutText, { color: colors.textSecondary }]}>
            {t("paywall.logout")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
    maxWidth: 340,
  },
  table: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  tableHeader: {
    borderBottomWidth: 1,
  },
  cellHeader: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cellPlan: {
    flex: 1.2,
  },
  cellPrice: {
    flex: 1.3,
    textAlign: "center",
  },
  cellQuestions: {
    flex: 1,
    textAlign: "center",
  },
  cellText: {
    fontSize: 14,
  },
  expiredBadge: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  contactDesc: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
    maxWidth: 360,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    width: "100%",
    maxWidth: 340,
    marginBottom: 16,
  },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
