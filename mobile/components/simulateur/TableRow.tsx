import { View, Text } from "react-native";

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
  return (
    <View
      className="flex-row items-center justify-between"
      style={{ backgroundColor: bg || "#fff", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#e5e7eb" }}
    >
      <Text style={{ fontSize: 12, color: color || "#374151", fontWeight: bold ? "600" : "400" }}>{label}</Text>
      <Text style={{ fontSize: 12, color: color || "#374151", fontWeight: "600" }}>{value}</Text>
    </View>
  );
}
