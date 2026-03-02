import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useTranslation } from "react-i18next";

interface Props {
  isMobile: boolean;
  isTablet: boolean;
}

const FEATURES: { icon: keyof typeof Ionicons.glyphMap; titleKey: string; descKey: string; color: string }[] = [
  { icon: "document-text-outline", titleKey: "landing.feat1Title", descKey: "landing.feat1Desc", color: "#00815d" },
  { icon: "book-outline", titleKey: "landing.feat2Title", descKey: "landing.feat2Desc", color: "#2563eb" },
  { icon: "mic-outline", titleKey: "landing.feat3Title", descKey: "landing.feat3Desc", color: "#9333ea" },
  { icon: "calculator-outline", titleKey: "landing.feat4Title", descKey: "landing.feat4Desc", color: "#ea580c" },
  { icon: "chatbubbles-outline", titleKey: "landing.feat5Title", descKey: "landing.feat5Desc", color: "#0891b2" },
  { icon: "calendar-outline", titleKey: "landing.feat6Title", descKey: "landing.feat6Desc", color: "#dc2626" },
  { icon: "people-outline", titleKey: "landing.feat7Title", descKey: "landing.feat7Desc", color: "#4f46e5" },
  { icon: "moon-outline", titleKey: "landing.feat8Title", descKey: "landing.feat8Desc", color: "#7c3aed" },
  { icon: "cloud-offline-outline", titleKey: "landing.feat9Title", descKey: "landing.feat9Desc", color: "#059669" },
  { icon: "phone-portrait-outline", titleKey: "landing.feat10Title", descKey: "landing.feat10Desc", color: "#d97706" },
];

export default function LandingFeatures({ isMobile, isTablet }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const cols = isMobile ? 1 : isTablet ? 2 : 3;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t("landing.featuresTitle")}
      </Text>
      <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
        {t("landing.featuresSubtitle")}
      </Text>

      <View
        style={[
          styles.grid,
          {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: cols === 1 ? "center" : "center",
            maxWidth: 1200,
          },
        ]}
      >
        {FEATURES.map((feat, i) => (
          <View
            key={i}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                width: cols === 1 ? "100%" : cols === 2 ? "47%" : "30%",
              },
            ]}
          >
            <View style={[styles.iconCircle, { backgroundColor: feat.color + "15" }]}>
              <Ionicons name={feat.icon} size={28} color={feat.color} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {t(feat.titleKey)}
            </Text>
            <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
              {t(feat.descKey)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    maxWidth: 500,
  },
  grid: {
    width: "100%",
    gap: 16,
    alignSelf: "center",
  },
  card: {
    borderWidth: 1,
    borderRadius: 0,
    padding: 24,
    minHeight: 160,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
});
