// mobile/components/chat/StreamingBubble.tsx
// Bulle de message en cours de streaming avec indicateur de chargement

import { View, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";

type Props = {
  content: string;
};

export default function StreamingBubble({ content }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        alignSelf: "flex-start",
        maxWidth: "85%",
        gap: 8,
      }}
    >
      <View
        style={{
          width: 30,
          height: 30,
          
          backgroundColor: colors.accent,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 2,
        }}
      >
        <Ionicons name="sparkles" size={16} color={colors.userBubbleText} />
      </View>
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: colors.assistantBubble,
            
            borderBottomLeftRadius: 4,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          {content ? (
            <Text style={{ color: colors.assistantBubbleText, fontSize: 14, lineHeight: 20 }} selectable>
              {content}
            </Text>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                {t("code.thinking")}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
