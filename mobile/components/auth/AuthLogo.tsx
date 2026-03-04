import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";
import { fonts, fontWeights } from "@/lib/theme/fonts";

type Props = {
  size?: "sm" | "md" | "lg";
};

const SIZES = {
  sm: { icon: 34, iconFont: 15, nameFont: 20, tagFont: 11 },
  md: { icon: 40, iconFont: 18, nameFont: 24, tagFont: 13 },
  lg: { icon: 44, iconFont: 20, nameFont: 26, tagFont: 13 },
};

export default function AuthLogo({ size = "md" }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const s = SIZES[size];

  return (
    <View style={{ alignItems: "center", marginBottom: size === "lg" ? 36 : 24 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: size === "lg" ? 8 : 6 }}>
        <View style={{ width: s.icon, height: s.icon, borderRadius: 10, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontFamily: fonts.black, fontWeight: fontWeights.black, fontSize: s.iconFont, color: colors.sidebar }}>N</Text>
        </View>
        <Text style={{ fontFamily: fonts.heading, fontWeight: fontWeights.heading, fontSize: s.nameFont, color: colors.text }}>
          NORMX <Text style={{ color: colors.primary }}>Tax</Text>
        </Text>
      </View>
      <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: s.tagFont, color: colors.textMuted, marginTop: size === "lg" ? 6 : 4 }}>
        {t("auth.tagline")}
      </Text>
    </View>
  );
}
