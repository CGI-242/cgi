import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/theme/ThemeContext";
import { fonts, fontWeights } from "@/lib/theme/fonts";

type Props = {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  onSearch?: () => void;
  rightElement?: React.ReactNode;
};

export default function MobileHeader({ title, showBack, onBack, onSearch, rightElement }: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        paddingVertical: 14,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
        {showBack && (
          <TouchableOpacity onPress={onBack} hitSlop={8}>
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
        {!showBack && (
          <View style={{ width: 28, height: 28, borderRadius: 7, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontFamily: fonts.black, fontWeight: fontWeights.black, fontSize: 13, color: "#fff" }}>N</Text>
          </View>
        )}
        <Text
          style={{
            fontFamily: fonts.extraBold,
            fontWeight: fontWeights.extraBold,
            fontSize: 17,
            color: colors.text,
            letterSpacing: -0.3,
          }}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
        {rightElement}
        {onSearch && (
          <TouchableOpacity onPress={onSearch} hitSlop={8}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
