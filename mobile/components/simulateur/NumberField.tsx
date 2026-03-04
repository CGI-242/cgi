import { View, Text, TextInput } from "react-native";
import { formatInputNumber } from "@/lib/services/fiscal-common";
import { useTheme } from "@/lib/theme/ThemeContext";

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  colors?: unknown;
}

export default function NumberField({ label, value, onChange }: Props) {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 3 }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.card, paddingHorizontal: 12, height: 40, borderWidth: 1, borderColor: colors.border }}>
        <TextInput
          style={{ flex: 1, fontSize: 14, fontWeight: "600", color: colors.text }}
          value={value}
          onChangeText={(v) => onChange(formatInputNumber(v))}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor={colors.textMuted}
        />
        <Text style={{ fontSize: 10, color: colors.textMuted }}>FCFA</Text>
      </View>
    </View>
  );
}
