import { View, Text, TouchableOpacity, ScrollView, Linking, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth";

const PLANS = [
  { key: "free", questions: "5 total", price: "0 XAF" },
  { key: "basic", questions: "15/mois", price: "75 000 XAF" },
  { key: "pro", questions: "30/mois", price: "115 000 XAF" },
];

const PACKS = [
  { name: "Pack 10", questions: 10, price: "6 000 XAF" },
  { name: "Pack 30", questions: 30, price: "15 000 XAF" },
  { name: "Pack 60", questions: 60, price: "30 000 XAF" },
];

export default function PaywallScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const logout = useAuthStore((s) => s.logout);

  const handleContact = () => {
    Linking.openURL("mailto:facturation@normx-ai.com?subject=Souscription%20CGI242");
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

        {/* Tableau abonnements */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t("paywall.subscriptions")}
        </Text>
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
              ]}
            >
              <Text style={[styles.cellText, styles.cellPlan, { color: colors.text, fontWeight: "700" }]}>
                {t(`paywall.${plan.key}`)}
              </Text>
              <Text style={[styles.cellText, styles.cellPrice, { color: colors.text, fontWeight: "700" }]}>
                {plan.price}
              </Text>
              <Text style={[styles.cellText, styles.cellQuestions, { color: colors.text }]}>
                {plan.questions}
              </Text>
            </View>
          ))}
        </View>

        {/* Remises volume */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
          {t("paywall.volumeDiscounts")}
        </Text>
        <View style={[styles.table, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.tableRow, styles.tableHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.cellHeader, { flex: 1, color: colors.textSecondary }]}>{t("paywall.users")}</Text>
            <Text style={[styles.cellHeader, { flex: 1, textAlign: "center", color: colors.textSecondary }]}>{t("paywall.discount")}</Text>
          </View>
          {[{ users: "3-4", discount: "-10%" }, { users: "5-9", discount: "-15%" }, { users: "10+", discount: "-20%" }].map((row, i, arr) => (
            <View key={row.users} style={[styles.tableRow, i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <Text style={[styles.cellText, { flex: 1, color: colors.text }]}>{row.users} users</Text>
              <Text style={[styles.cellText, { flex: 1, textAlign: "center", color: colors.primary, fontWeight: "700" }]}>{row.discount}</Text>
            </View>
          ))}
        </View>

        {/* Packs questions */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
          {t("paywall.questionPacks")}
        </Text>
        <View style={[styles.table, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.tableRow, styles.tableHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.cellHeader, { flex: 1, color: colors.textSecondary }]}>Pack</Text>
            <Text style={[styles.cellHeader, { flex: 1, textAlign: "center", color: colors.textSecondary }]}>{t("paywall.questions")}</Text>
            <Text style={[styles.cellHeader, { flex: 1, textAlign: "center", color: colors.textSecondary }]}>{t("paywall.price")}</Text>
          </View>
          {PACKS.map((pack, i) => (
            <View key={pack.name} style={[styles.tableRow, i < PACKS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <Text style={[styles.cellText, { flex: 1, color: colors.text, fontWeight: "700" }]}>{pack.name}</Text>
              <Text style={[styles.cellText, { flex: 1, textAlign: "center", color: colors.text }]}>{pack.questions}</Text>
              <Text style={[styles.cellText, { flex: 1, textAlign: "center", color: colors.text }]}>{pack.price}</Text>
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
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 17,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
    maxWidth: 400,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    alignSelf: "flex-start",
    maxWidth: 520,
    width: "100%",
  },
  table: {
    width: "100%",
    maxWidth: 520,
    borderRadius: 0,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  tableHeader: {
    borderBottomWidth: 1,
  },
  cellHeader: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cellPlan: {
    flex: 1,
  },
  cellPrice: {
    flex: 1.2,
    textAlign: "center",
  },
  cellQuestions: {
    flex: 0.9,
    textAlign: "center",
  },
  cellText: {
    fontSize: 15,
  },
  contactDesc: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 20,
    marginBottom: 20,
    maxWidth: 400,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 0,
    width: "100%",
    maxWidth: 340,
    marginBottom: 16,
  },
  ctaText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
