import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";

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
              onPress={() => router.push(sim.route as any)}
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
