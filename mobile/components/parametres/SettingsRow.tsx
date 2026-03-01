import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ThemeColors } from "@/lib/theme/colors";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

interface Props {
  icon: IoniconsName;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  colors: ThemeColors;
}

export default function SettingsRow({ icon, label, value, onPress, showChevron, colors }: Props) {
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
      }}
    >
      <Ionicons name={icon} size={20} color={colors.textSecondary} style={{ marginRight: 12 }} />
      <Text style={{ fontSize: 15, color: colors.text, flex: 1 }}>{label}</Text>
      {value ? (
        <Text style={{ fontSize: 14, color: colors.textMuted }}>{value}</Text>
      ) : null}
      {showChevron && (
        <Ionicons name="chevron-forward" size={18} color={colors.disabled} style={{ marginLeft: 4 }} />
      )}
    </Container>
  );
}

export function Divider({ colors }: { colors: ThemeColors }) {
  return <View style={{ height: 1, backgroundColor: colors.background, marginHorizontal: 16 }} />;
}
