import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/lib/theme/ThemeContext";

type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  options: Option<T>[];
  selected: T;
  onChange: (value: T) => void;
  direction?: "row" | "column";
  fontSize?: number;
};

export default function OptionButtonGroup<T extends string>({
  options,
  selected,
  onChange,
  direction = "row",
  fontSize = 11,
}: Props<T>) {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: direction, gap: direction === "row" ? 8 : 4, marginBottom: 12 }}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={{
            flex: direction === "row" ? 1 : undefined,
            paddingVertical: 8,
            paddingHorizontal: direction === "column" ? 12 : undefined,
            alignItems: direction === "row" ? "center" : undefined,
            backgroundColor: selected === opt.value ? colors.primary : colors.border,
          }}
          onPress={() => onChange(opt.value)}
        >
          <Text
            style={{
              color: selected === opt.value ? colors.sidebarText : colors.text,
              fontWeight: "700",
              fontSize,
            }}
          >
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
