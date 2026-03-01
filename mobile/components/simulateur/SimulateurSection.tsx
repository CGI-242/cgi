import { View, Text } from "react-native";

interface Props {
  label: string;
  colors: any;
}

export default function SimulateurSection({ label, colors }: Props) {
  return (
    <View style={{ backgroundColor: colors.background, paddingHorizontal: 14, paddingVertical: 8 }}>
      <Text style={{ fontSize: 12, fontWeight: "700", color: colors.text }}>{label}</Text>
    </View>
  );
}
