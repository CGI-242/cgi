import { Text } from "react-native";
import type { ThemeColors } from "@/lib/theme/colors";
import { fonts, fontWeights } from "@/lib/theme/fonts";

interface Props {
  title: string;
  colors: ThemeColors;
}

export default function SectionHeader({ title, colors }: Props) {
  return (
    <Text
      style={{
        color: colors.textSecondary,
        fontSize: 12,
        fontFamily: fonts.bold,
        fontWeight: fontWeights.bold,
        letterSpacing: 0.5,
        marginBottom: 8,
        marginTop: 16,
        marginLeft: 4,
      }}
    >
      {title}
    </Text>
  );
}
