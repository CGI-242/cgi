import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router, type Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";
import { fonts, fontWeights } from "@/lib/theme/fonts";

export default function SimulateurHub() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const simulateurs = [
    {
      id: "its",
      title: "ITS",
      subtitle: t("simulateur.its.subtitle"),
      description: t("simulateur.its.legalRef"),
      icon: "people-outline" as const,
      route: "/(app)/simulateur/its",
    },
    {
      id: "is",
      title: "Minimum IS",
      subtitle: t("simulateur.is.subtitle"),
      description: t("simulateur.is.legalRef"),
      icon: "business-outline" as const,
      route: "/(app)/simulateur/is",
    },
    {
      id: "patente",
      title: "Patente",
      subtitle: t("simulateur.patente.subtitle"),
      description: t("simulateur.patente.legalRef"),
      icon: "storefront-outline" as const,
      route: "/(app)/simulateur/patente",
    },
    {
      id: "solde-liquidation",
      title: "Solde IS",
      subtitle: t("simulateur.solde.subtitle"),
      description: t("simulateur.solde.legalRef"),
      icon: "cash-outline" as const,
      route: "/(app)/simulateur/solde-liquidation",
    },
    {
      id: "ircm",
      title: "IRCM",
      subtitle: t("simulateur.ircm.subtitle"),
      description: t("simulateur.ircm.legalRef"),
      icon: "trending-up-outline" as const,
      route: "/(app)/simulateur/ircm",
    },
    {
      id: "irf-loyers",
      title: "IRF Loyers",
      subtitle: t("simulateur.irfLoyers.subtitle"),
      description: t("simulateur.irfLoyers.legalRef"),
      icon: "home-outline" as const,
      route: "/(app)/simulateur/irf-loyers",
    },
    {
      id: "iba",
      title: "IBA",
      subtitle: t("simulateur.iba.subtitle"),
      description: t("simulateur.iba.legalRef"),
      icon: "briefcase-outline" as const,
      route: "/(app)/simulateur/iba",
    },
    {
      id: "tva",
      title: "TVA",
      subtitle: t("simulateur.tva.subtitle"),
      description: t("simulateur.tva.legalRef"),
      icon: "receipt-outline" as const,
      route: "/(app)/simulateur/tva",
    },
    {
      id: "igf",
      title: "IGF",
      subtitle: t("simulateur.igf.subtitle"),
      description: t("simulateur.igf.legalRef"),
      icon: "grid-outline" as const,
      route: "/(app)/simulateur/igf",
    },
    {
      id: "enregistrement",
      title: "Enregistrement",
      subtitle: t("simulateur.enreg.subtitle"),
      description: t("simulateur.enreg.legalRef"),
      icon: "document-text-outline" as const,
      route: "/(app)/simulateur/enregistrement",
    },
    {
      id: "cession-parts",
      title: "Cessions Parts",
      subtitle: t("simulateur.cessionParts.subtitle"),
      description: t("simulateur.cessionParts.legalRef"),
      icon: "swap-horizontal-outline" as const,
      route: "/(app)/simulateur/cession-parts",
    },
    {
      id: "contribution-fonciere",
      title: "Foncier",
      subtitle: t("simulateur.foncier.subtitle"),
      description: t("simulateur.foncier.legalRef"),
      icon: "map-outline" as const,
      route: "/(app)/simulateur/contribution-fonciere",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Cards en grille */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {simulateurs.map((sim) => (
            <TouchableOpacity
              key={sim.id}
              style={{
                width: "48%",
                backgroundColor: colors.card,
                
                borderWidth: 1,
                borderColor: colors.border,
                padding: 16,
              }}
              onPress={() => router.push(sim.route as Href)}
            >
              <View
                style={{
                  backgroundColor: `${colors.primary}15`,
                  width: 44,
                  height: 44,
                  
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons name={sim.icon} size={24} color={colors.primary} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: "800", color: colors.primary, marginBottom: 2 }}>{sim.title}</Text>
              <View style={{ backgroundColor: `${colors.primary}20`, marginBottom: 6, paddingHorizontal: 8, paddingVertical: 2, alignSelf: "flex-start" }}>
                <Text style={{ fontSize: 9, fontWeight: "700", color: colors.primary }}>CGI 2026</Text>
              </View>
              <Text style={{ fontSize: 12, color: colors.text, fontWeight: "500", marginBottom: 2 }}>{sim.subtitle}</Text>
              <Text style={{ fontSize: 10, color: colors.textSecondary }}>{sim.description}</Text>
            </TouchableOpacity>
          ))}

        </View>
      </ScrollView>
    </View>
  );
}
