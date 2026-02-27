// mobile/app/(app)/chat/index.tsx
// Écran Chat IA fiscal — orchestration des composants

import { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from "react-native";
import {
  sendMessageStream,
  getConversation,
  getConversations,
  deleteConversation,
  type Conversation,
  type Citation,
} from "@/lib/api/chat";
import { getSearchHistory, type SearchHistoryItem } from "@/lib/api/search-history";
import ChatHeader from "@/components/chat/ChatHeader";
import HistoryPanel from "@/components/chat/HistoryPanel";
import EmptyState from "@/components/chat/EmptyState";
import MessageBubble from "@/components/chat/MessageBubble";
import StreamingBubble from "@/components/chat/StreamingBubble";
import ChatInput from "@/components/chat/ChatInput";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
import { useOfflineQueue } from "@/lib/store/offlineQueue";
import { useTheme } from "@/lib/theme/ThemeContext";

interface DisplayMessage {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  citations?: Citation[];
  pending?: boolean;
}

const PANEL_WIDTH = 280;

export default function ChatScreen() {
  const { colors } = useTheme();
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

  // Recherches récentes
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);
  const slideAnim = useRef(new Animated.Value(-PANEL_WIDTH)).current;

  const scrollToBottom = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  // Animation panneau
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: showHistory ? 0 : -PANEL_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [showHistory]);

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

  // Recherches récentes au montage
  useEffect(() => {
    getSearchHistory(1, 8)
      .then((data) => setRecentSearches(data.searches))
      .catch(() => {});
  }, []);

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
            id: `error-${Date.now()}`, role: "ASSISTANT", content: `Erreur : ${error}`,
          }]);
          setStreamingContent("");
          setIsStreaming(false);
        },
      });
    } catch {
      setMessages((prev) => [...prev, {
        id: `error-${Date.now()}`, role: "ASSISTANT", content: "Erreur de connexion au serveur.",
      }]);
      setStreamingContent("");
      setIsStreaming(false);
    }
  }, [input, isStreaming, conversationId, scrollToBottom, isOnline, addToQueue]);

  const handleNewConversation = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setStreamingContent("");
    setShowHistory(false);
  }, []);

  const handleLoadConversation = useCallback((id: string) => {
    setMessages([]);
    setConversationId(id);
    setShowHistory(false);
  }, []);

  const handleDeleteConversation = useCallback(
    (id: string, title: string | null) => {
      Alert.alert("Supprimer la conversation", `Supprimer "${title || "Sans titre"}" ?`, [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
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
              Alert.alert("Erreur", "Impossible de supprimer la conversation.");
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
      <ChatHeader
        conversationId={conversationId}
        onToggleHistory={() => setShowHistory((prev) => !prev)}
        onNewConversation={handleNewConversation}
      />

      <View style={{ flex: 1 }}>
        {/* Backdrop */}
        {showHistory && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowHistory(false)}
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              zIndex: 10,
            }}
          />
        )}

        {/* Panneau historique */}
        <Animated.View
          style={{
            position: "absolute",
            top: 0, left: 0, bottom: 0,
            width: PANEL_WIDTH,
            backgroundColor: colors.headerBg,
            zIndex: 15,
            transform: [{ translateX: slideAnim }],
            borderRightWidth: 1,
            borderRightColor: "#333",
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
        </Animated.View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1, paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingVertical: 16, gap: 12 }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 && !isStreaming && (
            <EmptyState recentSearches={recentSearches} onSelectQuery={setInput} />
          )}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} role={msg.role} content={msg.content} citations={msg.citations} pending={msg.pending} />
          ))}
          {isStreaming && <StreamingBubble content={streamingContent} />}
        </ScrollView>

        <ChatInput value={input} onChangeText={setInput} onSend={handleSend} disabled={isStreaming} />
      </View>
    </KeyboardAvoidingView>
  );
}
