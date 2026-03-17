import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { fonts, fontWeights } from "@/lib/theme/fonts";

interface Props {
  isMobile: boolean;
  loaded: boolean;
}

const FEATURE_ICONS = [
  { icon: "book-outline" as const, titleKey: "landing.feat1Title", descKey: "landing.feat1Desc", color: "#00815d" },
  { icon: "chatbubbles-outline" as const, titleKey: "landing.feat2Title", descKey: "landing.feat2Desc", color: "#0284c7" },
  { icon: "calculator-outline" as const, titleKey: "landing.feat4Title", descKey: "landing.feat4Desc", color: "#4f46e5" },
  { icon: "mic-outline" as const, titleKey: "landing.feat3Title", descKey: "landing.feat3Desc", color: "#9333ea" },
  { icon: "calendar-outline" as const, titleKey: "landing.feat6Title", descKey: "landing.feat6Desc", color: "#ef4444" },
  { icon: "cloud-offline-outline" as const, titleKey: "landing.feat9Title", descKey: "landing.feat9Desc", color: "#d97706" },
  { icon: "people-outline" as const, titleKey: "landing.feat7Title", descKey: "landing.feat7Desc", color: "#0891b2" },
  { icon: "language-outline" as const, titleKey: "landing.feat8Title", descKey: "landing.feat8Desc", color: "#D4A843" },
];

export default function LandingFeatures({ isMobile, loaded }: Props) {
  const { t } = useTranslation();

  return (
    <View
      style={{
        maxWidth: 1060,
        alignSelf: "center",
        width: "100%",
        paddingHorizontal: 24,
        paddingBottom: 60,
      }}
    >
      <Text
        style={{
          fontFamily: fonts.headingBlack,
          fontWeight: fontWeights.headingBlack,
          fontSize: isMobile ? 28 : 36,
          color: "#e8e6e1",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        {t("landing.featuresTitle")}
      </Text>
      <Text
        style={{
          fontSize: isMobile ? 14 : 16,
          color: "#5a5a65",
          textAlign: "center",
          fontFamily: fonts.light,
          fontWeight: fontWeights.light,
          marginBottom: 36,
        }}
      >
        {t("landing.featuresSubtitle")}
      </Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        {FEATURE_ICONS.map((feat, i) => (
          <View
            key={i}
            style={{
              width: isMobile ? "100%" : "48%",
              flexGrow: 1,
              flexBasis: isMobile ? "100%" : 220,
              backgroundColor: "rgba(255,255,255,0.015)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.05)",
              borderRadius: 16,
              padding: isMobile ? 22 : 28,
              opacity: loaded ? 1 : 0,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: `${feat.color}15`,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Ionicons name={feat.icon} size={22} color={feat.color} />
            </View>
            <Text
              style={{
                fontSize: 17,
                fontFamily: fonts.bold,
                fontWeight: fontWeights.bold,
                color: "#e8e6e1",
                marginBottom: 6,
              }}
            >
              {t(feat.titleKey)}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "#5a5a65",
                lineHeight: 20,
                fontFamily: fonts.light,
                fontWeight: fontWeights.light,
              }}
            >
              {t(feat.descKey)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
