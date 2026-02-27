import { View, Text } from "react-native";
import { useTheme } from "@/lib/theme/ThemeContext";

export default function TableRow({
  label,
  value,
  bg,
  bold,
  color,
}: {
  label: string;
  value: string;
  bg?: string;
  bold?: boolean;
  color?: string;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: bg || colors.card,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}
    >
      <Text style={{ fontSize: 12, color: color || colors.text, fontWeight: bold ? "600" : "400" }}>{label}</Text>
      <Text style={{ fontSize: 12, color: color || colors.text, fontWeight: "600" }}>{value}</Text>
    </View>
  );
}
