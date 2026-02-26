// mobile/app/(app)/chat/index.tsx
// Ecran Chat IA fiscal

import { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { sendMessageStream, getConversation, type ChatMessage } from "@/lib/api/chat";

interface DisplayMessage {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt?: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  // Charger la conversation existante si on en a une
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
                  createdAt: m.createdAt,
                }))
            );
          }
        })
        .catch(() => {
          // ignore - nouvelle conversation
        });
    }
  }, [conversationId]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    // Ajouter le message user
    const userMsg: DisplayMessage = {
      id: `user-${Date.now()}`,
      role: "USER",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);
    setStreamingContent("");
    scrollToBottom();

    try {
      await sendMessageStream(text, conversationId || undefined, {
        onConversation: (id) => {
          setConversationId(id);
        },
        onChunk: (chunk) => {
          setStreamingContent((prev) => prev + chunk);
          scrollToBottom();
        },
        onDone: (metadata) => {
          setStreamingContent((prev) => {
            const finalContent = prev;
            setMessages((msgs) => [
              ...msgs,
              {
                id: metadata.messageId,
                role: "ASSISTANT",
                content: finalContent,
              },
            ]);
            return "";
          });
          setIsStreaming(false);
          scrollToBottom();
        },
        onError: (error) => {
          setMessages((prev) => [
            ...prev,
            {
              id: `error-${Date.now()}`,
              role: "ASSISTANT",
              content: `Erreur : ${error}`,
            },
          ]);
          setStreamingContent("");
          setIsStreaming(false);
        },
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "ASSISTANT",
          content: "Erreur de connexion au serveur.",
        },
      ]);
      setStreamingContent("");
      setIsStreaming(false);
    }
  }, [input, isStreaming, conversationId, scrollToBottom]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f3f4f6" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View
        style={{
          backgroundColor: "#1a1a1a",
          paddingTop: 12,
          paddingBottom: 12,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#333",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 12 }}
          accessibilityLabel="Retour"
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Ionicons
          name="chatbubbles-outline"
          size={20}
          color="#00c17c"
          style={{ marginRight: 8 }}
        />
        <Text style={{ color: "#00c17c", fontSize: 17, fontWeight: "700", flex: 1 }}>
          Chat IA fiscal
        </Text>
        {conversationId && (
          <TouchableOpacity
            onPress={() => {
              setMessages([]);
              setConversationId(null);
              setStreamingContent("");
            }}
            accessibilityLabel="Nouvelle conversation"
          >
            <Ionicons name="add-circle-outline" size={22} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Zone messages */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingVertical: 16, gap: 12 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 && !isStreaming && (
          <View style={{ alignItems: "center", paddingTop: 60 }}>
            <Ionicons name="chatbubbles-outline" size={48} color="#d1d5db" />
            <Text style={{ color: "#9ca3af", fontSize: 16, marginTop: 12, textAlign: "center" }}>
              Posez votre question fiscale
            </Text>
            <Text style={{ color: "#d1d5db", fontSize: 13, marginTop: 4, textAlign: "center" }}>
              ITS, IS, TVA, patente, articles du CGI 2026...
            </Text>
          </View>
        )}

        {messages.map((msg) => (
          <View
            key={msg.id}
            style={{
              alignSelf: msg.role === "USER" ? "flex-end" : "flex-start",
              maxWidth: "80%",
            }}
          >
            <View
              style={{
                backgroundColor: msg.role === "USER" ? "#00815d" : "#fff",
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 10,
                ...(msg.role === "USER"
                  ? { borderBottomRightRadius: 4 }
                  : { borderBottomLeftRadius: 4, borderWidth: 1, borderColor: "#e5e7eb" }),
              }}
            >
              <Text
                style={{
                  color: msg.role === "USER" ? "#fff" : "#1f2937",
                  fontSize: 14,
                  lineHeight: 20,
                }}
                selectable
              >
                {msg.content}
              </Text>
            </View>
          </View>
        ))}

        {/* Message en cours de streaming */}
        {isStreaming && (
          <View style={{ alignSelf: "flex-start", maxWidth: "80%" }}>
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                borderBottomLeftRadius: 4,
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderWidth: 1,
                borderColor: "#e5e7eb",
              }}
            >
              {streamingContent ? (
                <Text
                  style={{ color: "#1f2937", fontSize: 14, lineHeight: 20 }}
                  selectable
                >
                  {streamingContent}
                </Text>
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <ActivityIndicator size="small" color="#00815d" />
                  <Text style={{ color: "#9ca3af", fontSize: 13 }}>
                    Reflexion en cours...
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View
        style={{
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            backgroundColor: "#f3f4f6",
            borderRadius: 20,
            paddingHorizontal: 14,
            paddingVertical: 6,
            gap: 8,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              fontSize: 14,
              color: "#1f2937",
              maxHeight: 100,
              paddingVertical: 6,
            }}
            placeholder="Posez votre question fiscale..."
            placeholderTextColor="#9ca3af"
            value={input}
            onChangeText={setInput}
            multiline
            editable={!isStreaming}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={isStreaming || !input.trim()}
            style={{
              backgroundColor:
                isStreaming || !input.trim() ? "#d1d5db" : "#00815d",
              borderRadius: 18,
              width: 36,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
            }}
            accessibilityLabel="Envoyer"
          >
            <Ionicons
              name="send"
              size={16}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            color: "#9ca3af",
            fontSize: 10,
            textAlign: "center",
            marginTop: 4,
          }}
        >
          CGI 242 peut faire des erreurs. Verifiez les informations importantes.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
