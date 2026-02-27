// mobile/components/chat/ChatHeader.tsx
// Barre de navigation du chat IA fiscal

import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/theme/ThemeContext";

type Props = {
  conversationId: string | null;
  onToggleHistory: () => void;
  onNewConversation: () => void;
};

export default function ChatHeader({
  conversationId,
  onToggleHistory,
  onNewConversation,
}: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.headerBg,
        paddingTop: 12,
        paddingBottom: 12,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#333",
        zIndex: 20,
      }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginRight: 8 }}
        accessibilityLabel="Retour"
      >
        <Ionicons name="arrow-back" size={22} color={colors.sidebarText} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onToggleHistory}
        style={{ marginRight: 12 }}
        accessibilityLabel="Historique"
      >
        <Ionicons name="time-outline" size={22} color={colors.sidebarText} />
      </TouchableOpacity>
      <Ionicons
        name="chatbubbles-outline"
        size={20}
        color={colors.accent}
        style={{ marginRight: 8 }}
      />
      <Text style={{ color: colors.accent, fontSize: 17, fontWeight: "700", flex: 1 }}>
        Chat IA fiscal
      </Text>
      {conversationId && (
        <TouchableOpacity
          onPress={onNewConversation}
          accessibilityLabel="Nouvelle conversation"
        >
          <Ionicons name="add-circle-outline" size={22} color={colors.sidebarText} />
        </TouchableOpacity>
      )}
    </View>
  );
}
