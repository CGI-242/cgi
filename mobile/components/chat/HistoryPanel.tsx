// mobile/components/chat/HistoryPanel.tsx
// Panneau latéral d'historique des conversations avec recherche

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Conversation } from "@/lib/api/chat";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

interface DateGroup {
  label: string;
  items: Conversation[];
}

function formatRelativeDate(dateStr: string, t: TFunction): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return t("chat.timeJustNow");
  if (diffMins < 60) return `${t("chat.timeAgo")} ${diffMins} ${t("chat.timeMinutes")}`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${t("chat.timeAgo")} ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return t("chat.timeYesterday");
  if (diffDays < 7) return `${t("chat.timeAgo")} ${diffDays}j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function groupByDate(conversations: Conversation[], t: TFunction): DateGroup[] {
  const groups: Map<string, Conversation[]> = new Map();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 7 * 86400000);

  const monthKeys = [
    "months.january", "months.february", "months.march", "months.april",
    "months.may", "months.june", "months.july", "months.august",
    "months.september", "months.october", "months.november", "months.december",
  ];

  for (const conv of conversations) {
    const date = new Date(conv.updatedAt);
    const convDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    let label: string;
    if (convDay.getTime() === today.getTime()) {
      label = t("chat.timeToday");
    } else if (convDay.getTime() === yesterday.getTime()) {
      label = t("chat.timeYesterday");
    } else if (convDay.getTime() > weekAgo.getTime()) {
      const days = Math.round((today.getTime() - convDay.getTime()) / 86400000);
      label = `${t("chat.timeAgo")} ${days} jours`;
    } else {
      label = `${t(monthKeys[date.getMonth()])} ${date.getFullYear()}`;
    }

    if (!groups.has(label)) {
      groups.set(label, []);
    }
    groups.get(label)!.push(conv);
  }

  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
}

type Props = {
  conversations: Conversation[];
  loading: boolean;
  activeConversationId: string | null;
  onNewConversation: () => void;
  onLoadConversation: (id: string) => void;
  onDeleteConversation: (id: string, title: string | null) => void;
  onClose: () => void;
};

export default function HistoryPanel({
  conversations,
  loading,
  activeConversationId,
  onNewConversation,
  onLoadConversation,
  onDeleteConversation,
  onClose,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? conversations.filter((c) =>
        (c.title || "").toLowerCase().includes(search.toLowerCase())
      )
    : conversations;
  const dateGroups = groupByDate(filtered, t);

  return (
    <>
      {/* Header panneau */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: "#333",
        }}
      >
        <Text style={{ color: colors.sidebarText, fontSize: 16, fontWeight: "700" }}>
          {t("chat.history")}
        </Text>
        <TouchableOpacity onPress={onClose} accessibilityLabel={t("chat.closeHistory")}>
          <Ionicons name="close" size={22} color="#aaa" />
        </TouchableOpacity>
      </View>

      {/* Bouton nouvelle conversation */}
      <TouchableOpacity
        onPress={onNewConversation}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginHorizontal: 12,
          marginTop: 12,
          marginBottom: 8,
          backgroundColor: colors.primary,
          borderRadius: 8,
          paddingVertical: 10,
          paddingHorizontal: 14,
        }}
      >
        <Ionicons name="add" size={18} color={colors.sidebarText} />
        <Text style={{ color: colors.sidebarText, fontSize: 14, fontWeight: "600" }}>
          {t("chat.newConversation")}
        </Text>
      </TouchableOpacity>

      {/* Champ de recherche */}
      <View
        style={{
          marginHorizontal: 12,
          marginBottom: 8,
          backgroundColor: "#2a2a2a",
          borderRadius: 8,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        <Ionicons name="search" size={16} color="#888" />
        <TextInput
          style={{
            flex: 1,
            color: "#ddd",
            fontSize: 13,
            paddingVertical: 8,
            marginLeft: 8,
          }}
          placeholder={t("chat.searchPlaceholder")}
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={16} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Liste des conversations */}
      {loading ? (
        <View style={{ paddingTop: 40, alignItems: "center" }}>
          <ActivityIndicator size="small" color={colors.accent} />
          <Text style={{ color: "#888", fontSize: 13, marginTop: 8 }}>
            {t("common.loading")}
          </Text>
        </View>
      ) : conversations.length === 0 ? (
        <View style={{ paddingTop: 40, alignItems: "center", paddingHorizontal: 20 }}>
          <Ionicons name="chatbubbles-outline" size={32} color="#555" />
          <Text style={{ color: "#888", fontSize: 13, marginTop: 8, textAlign: "center" }}>
            {t("chat.noConversations")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={dateGroups}
          keyExtractor={(item) => item.label}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item: group }) => (
            <View>
              <Text
                style={{
                  color: "#888",
                  fontSize: 11,
                  fontWeight: "600",
                  textTransform: "uppercase",
                  paddingHorizontal: 16,
                  paddingTop: 16,
                  paddingBottom: 6,
                }}
              >
                {group.label}
              </Text>
              {group.items.map((conv) => (
                <TouchableOpacity
                  key={conv.id}
                  onPress={() => onLoadConversation(conv.id)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    backgroundColor:
                      conv.id === activeConversationId ? "#2a2a2a" : "transparent",
                  }}
                >
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: conv.id === activeConversationId ? colors.accent : colors.sidebarText,
                        fontSize: 13,
                      }}
                    >
                      {conv.title || t("chat.untitled")}
                    </Text>
                    <Text style={{ color: "#666", fontSize: 11, marginTop: 2 }}>
                      {conv._count?.messages ?? 0} {(conv._count?.messages ?? 0) > 1 ? t("chat.messages") : t("chat.message")} · {formatRelativeDate(conv.updatedAt, t)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => onDeleteConversation(conv.id, conv.title)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityLabel={t("chat.deleteConversation")}
                  >
                    <Ionicons name="trash-outline" size={16} color="#666" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
      )}
    </>
  );
}
