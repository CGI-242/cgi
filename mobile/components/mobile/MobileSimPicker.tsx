import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { fonts, fontWeights } from "@/lib/theme/fonts";

const SIMULATEURS: {
  id: string;
  titleKey: string;
  subtitleKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}[] = [
  { id: "its", titleKey: "simulateur.its.title", subtitleKey: "simulateur.its.subtitle", icon: "people-outline", route: "/(app)/simulateur/its" },
  { id: "is", titleKey: "simulateur.is.title", subtitleKey: "simulateur.is.subtitle", icon: "business-outline", route: "/(app)/simulateur/is" },
  { id: "patente", titleKey: "simulateur.patente.title", subtitleKey: "simulateur.patente.subtitle", icon: "storefront-outline", route: "/(app)/simulateur/patente" },
  { id: "solde", titleKey: "simulateur.solde.title", subtitleKey: "simulateur.solde.subtitle", icon: "cash-outline", route: "/(app)/simulateur/solde-liquidation" },
  { id: "ircm", titleKey: "simulateur.ircm.title", subtitleKey: "simulateur.ircm.subtitle", icon: "trending-up-outline", route: "/(app)/simulateur/ircm" },
  { id: "irf", titleKey: "simulateur.irfLoyers.title", subtitleKey: "simulateur.irfLoyers.subtitle", icon: "home-outline", route: "/(app)/simulateur/irf-loyers" },
  { id: "iba", titleKey: "simulateur.iba.title", subtitleKey: "simulateur.iba.subtitle", icon: "briefcase-outline", route: "/(app)/simulateur/iba" },
  { id: "tva", titleKey: "simulateur.tva.title", subtitleKey: "simulateur.tva.subtitle", icon: "receipt-outline", route: "/(app)/simulateur/tva" },
  { id: "igf", titleKey: "simulateur.igf.title", subtitleKey: "simulateur.igf.subtitle", icon: "grid-outline", route: "/(app)/simulateur/igf" },
  { id: "enreg", titleKey: "simulateur.enreg.title", subtitleKey: "simulateur.enreg.subtitle", icon: "document-text-outline", route: "/(app)/simulateur/enregistrement" },
  { id: "cession", titleKey: "simulateur.cessionParts.title", subtitleKey: "simulateur.cessionParts.subtitle", icon: "swap-horizontal-outline", route: "/(app)/simulateur/cession-parts" },
  { id: "foncier", titleKey: "simulateur.foncier.title", subtitleKey: "simulateur.foncier.subtitle", icon: "map-outline", route: "/(app)/simulateur/contribution-fonciere" },
];

export default function MobileSimPicker() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 18, paddingBottom: 30 }}>
      <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 15, color: colors.textSecondary, marginBottom: 20 }}>
        {t("simulateur.subtitle")}
      </Text>

      {SIMULATEURS.map((sim) => (
        <TouchableOpacity
          key={sim.id}
          onPress={() => router.push(sim.route as Href)}
          style={{
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 14,
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            padding: 18,
            marginBottom: 10,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: `${colors.primary}15`,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name={sim.icon} size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 15, color: colors.text, marginBottom: 2 }}>
              {t(sim.titleKey)}
            </Text>
            <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 12, color: colors.textMuted }} numberOfLines={1}>
              {t(sim.subtitleKey)}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: `${colors.primary}15`,
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 12, color: colors.primary }}>
              {t("simulateur.calculate")}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
