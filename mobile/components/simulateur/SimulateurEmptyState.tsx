import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/theme/ThemeContext";

type Props = {
  message: string;
};

export default function SimulateurEmptyState({ message }: Props) {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
      <Ionicons name="calculator-outline" size={40} color={colors.disabled} />
      <Text style={{ fontSize: 17, color: colors.textMuted, marginTop: 12, textAlign: "center" }}>
        {message}
      </Text>
    </View>
  );
}
