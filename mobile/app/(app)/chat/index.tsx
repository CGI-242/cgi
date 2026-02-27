// mobile/app/(app)/chat/index.tsx
// Écran Chat IA fiscal — sidebar historique + zone chat

import { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import {
  sendMessageStream,
  getConversation,
  getConversations,
  deleteConversation,
  type Conversation,
  type Citation,
} from "@/lib/api/chat";
import { Ionicons } from "@expo/vector-icons";
import HistoryPanel from "@/components/chat/HistoryPanel";
import EmptyState from "@/components/chat/EmptyState";
import MessageBubble from "@/components/chat/MessageBubble";
import StreamingBubble from "@/components/chat/StreamingBubble";
import ChatInput from "@/components/chat/ChatInput";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
import { useOfflineQueue } from "@/lib/store/offlineQueue";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useTranslation } from "react-i18next";

interface DisplayMessage {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  citations?: Citation[];
  pending?: boolean;
}

const HISTORY_WIDTH = 260;

export default function ChatScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const pendingCitationsRef = useRef<Citation[]>([]);

  // Historique
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Offline queue
  const isOnline = useOnlineStatus();
  const addToQueue = useOfflineQueue((s) => s.addMessage);


  const scrollToBottom = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  // Charger historique à l'ouverture du panneau
  useEffect(() => {
    if (showHistory) {
      setLoadingHistory(true);
      getConversations()
        .then(setConversations)
        .catch(() => setConversations([]))
        .finally(() => setLoadingHistory(false));
    }
  }, [showHistory]);


  // Charger conversation existante
  useEffect(() => {
    if (conversationId && messages.length === 0) {
      getConversation(conversationId)
        .then((conv) => {
          if (conv.messages) {
            setMessages(
              conv.messages
                .filter((m) => m.role !== "SYSTEM")
                .map((m) => ({
                  id: m.id,
                  role: m.role as "USER" | "ASSISTANT",
                  content: m.content,
                  citations: m.citations,
                }))
            );
          }
        })
        .catch(() => {});
    }
  }, [conversationId]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    if (!isOnline) {
      addToQueue(text, conversationId || undefined);
      setMessages((prev) => [...prev, { id: `queued-${Date.now()}`, role: "USER", content: text, pending: true }]);
      setInput("");
      scrollToBottom();
      return;
    }

    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: "USER", content: text }]);
    setInput("");
    setIsStreaming(true);
    setStreamingContent("");
    pendingCitationsRef.current = [];
    scrollToBottom();

    try {
      await sendMessageStream(text, conversationId || undefined, {
        onConversation: (id) => setConversationId(id),
        onChunk: (chunk) => {
          setStreamingContent((prev) => prev + chunk);
          scrollToBottom();
        },
        onCitations: (citations) => {
          pendingCitationsRef.current = citations;
        },
        onDone: (metadata) => {
          const citations = pendingCitationsRef.current.length > 0
            ? pendingCitationsRef.current : undefined;
          setStreamingContent((prev) => {
            setMessages((msgs) => [...msgs, {
              id: metadata.messageId, role: "ASSISTANT", content: prev, citations,
            }]);
            return "";
          });
          pendingCitationsRef.current = [];
          setIsStreaming(false);
          scrollToBottom();
        },
        onError: (error) => {
          setMessages((prev) => [...prev, {
            id: `error-${Date.now()}`, role: "ASSISTANT", content: `${t("chat.errorPrefix")} ${error}`,
          }]);
          setStreamingContent("");
          setIsStreaming(false);
        },
      });
    } catch {
      setMessages((prev) => [...prev, {
        id: `error-${Date.now()}`, role: "ASSISTANT", content: t("chat.connectionError"),
      }]);
      setStreamingContent("");
      setIsStreaming(false);
    }
  }, [input, isStreaming, conversationId, scrollToBottom, isOnline, addToQueue]);

  const handleNewConversation = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setStreamingContent("");
  }, []);

  const handleLoadConversation = useCallback((id: string) => {
    setMessages([]);
    setConversationId(id);
  }, []);

  const handleDeleteConversation = useCallback(
    (id: string, title: string | null) => {
      Alert.alert(t("chat.deleteConversation"), `${t("chat.deleteConversation")} "${title || t("chat.untitled")}" ?`, [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("chat.deleteConversation"),
          style: "destructive",
          onPress: async () => {
            try {
              await deleteConversation(id);
              setConversations((prev) => prev.filter((c) => c.id !== id));
              if (id === conversationId) {
                setMessages([]);
                setConversationId(null);
                setStreamingContent("");
              }
            } catch {
              Alert.alert(t("chat.errorPrefix"), t("chat.connectionError"));
            }
          },
        },
      ]);
    },
    [conversationId]
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Barre d'outils chat */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity
          onPress={() => setShowHistory((prev) => !prev)}
          accessibilityLabel={t("chat.history")}
          accessibilityRole="button"
          style={{ padding: 6, marginRight: 8 }}
        >
          <Ionicons name={showHistory ? "close" : "time-outline"} size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 14, color: colors.textSecondary }}>
          {showHistory ? t("chat.history") : t("chat.emptyStateDesc")}
        </Text>
        {conversationId && (
          <TouchableOpacity
            onPress={handleNewConversation}
            accessibilityLabel={t("chat.newConversation")}
            accessibilityRole="button"
            style={{ padding: 6 }}
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* Sidebar 2 : Historique */}
        {showHistory && (
          <View
            style={{
              width: HISTORY_WIDTH,
              backgroundColor: colors.headerBg,
              borderRightWidth: 1,
              borderRightColor: colors.border,
            }}
          >
            <HistoryPanel
              conversations={conversations}
              loading={loadingHistory}
              activeConversationId={conversationId}
              onNewConversation={handleNewConversation}
              onLoadConversation={handleLoadConversation}
              onDeleteConversation={handleDeleteConversation}
              onClose={() => setShowHistory(false)}
            />
          </View>
        )}

        {/* Zone chat */}
        <View style={{ flex: 1 }}>
          <ScrollView
            ref={scrollRef}
            style={{ flex: 1, paddingHorizontal: 16 }}
            contentContainerStyle={{ paddingVertical: 16, gap: 12 }}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.length === 0 && !isStreaming && (
              <EmptyState recentSearches={[]} onSelectQuery={setInput} />
            )}
            {messages.map((msg) => (
              <MessageBubble key={msg.id} role={msg.role} content={msg.content} citations={msg.citations} pending={msg.pending} />
            ))}
            {isStreaming && <StreamingBubble content={streamingContent} />}
          </ScrollView>

          <ChatInput value={input} onChangeText={setInput} onSend={handleSend} disabled={isStreaming} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
