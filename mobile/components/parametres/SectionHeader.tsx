import { Text } from "react-native";
import type { ThemeColors } from "@/lib/theme/colors";

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
        fontWeight: "700",
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
