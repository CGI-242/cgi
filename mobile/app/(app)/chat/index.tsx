// mobile/app/(app)/chat/index.tsx
// Écran Chat IA fiscal avec panneau historique des conversations

import { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  sendMessageStream,
  getConversation,
  getConversations,
  deleteConversation,
  type ChatMessage,
  type Conversation,
} from "@/lib/api/chat";

interface DisplayMessage {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt?: string;
}

interface DateGroup {
  label: string;
  items: Conversation[];
}

const PANEL_WIDTH = 280;

/**
 * Grouper les conversations par date relative
 */
function groupByDate(conversations: Conversation[]): DateGroup[] {
  const groups: Map<string, Conversation[]> = new Map();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 7 * 86400000);

  for (const conv of conversations) {
    const date = new Date(conv.updatedAt);
    const convDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    let label: string;
    if (convDay.getTime() === today.getTime()) {
      label = "Aujourd'hui";
    } else if (convDay.getTime() === yesterday.getTime()) {
      label = "Hier";
    } else if (convDay.getTime() > weekAgo.getTime()) {
      const days = Math.round((today.getTime() - convDay.getTime()) / 86400000);
      label = `Il y a ${days} jours`;
    } else {
      const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
      ];
      label = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    }

    if (!groups.has(label)) {
      groups.set(label, []);
    }
    groups.get(label)!.push(conv);
  }

  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  // Historique
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const slideAnim = useRef(new Animated.Value(-PANEL_WIDTH)).current;

  const scrollToBottom = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  // Animation du panneau
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: showHistory ? 0 : -PANEL_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [showHistory]);

  // Charger l'historique quand on ouvre le panneau
  useEffect(() => {
    if (showHistory) {
      setLoadingHistory(true);
      getConversations()
        .then((convs) => setConversations(convs))
        .catch(() => setConversations([]))
        .finally(() => setLoadingHistory(false));
    }
  }, [showHistory]);

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

  // Nouvelle conversation
  const handleNewConversation = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setStreamingContent("");
    setShowHistory(false);
  }, []);

  // Charger une conversation depuis l'historique
  const handleLoadConversation = useCallback((id: string) => {
    setMessages([]);
    setConversationId(id);
    setShowHistory(false);
  }, []);

  // Supprimer une conversation
  const handleDeleteConversation = useCallback(
    (id: string, title: string | null) => {
      Alert.alert(
        "Supprimer la conversation",
        `Supprimer "${title || "Sans titre"}" ?`,
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteConversation(id);
                setConversations((prev) => prev.filter((c) => c.id !== id));
                // Si c'est la conversation active, reset le chat
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
        ]
      );
    },
    [conversationId]
  );

  const dateGroups = groupByDate(conversations);

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
          zIndex: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 8 }}
          accessibilityLabel="Retour"
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowHistory((prev) => !prev)}
          style={{ marginRight: 12 }}
          accessibilityLabel="Historique"
        >
          <Ionicons name="time-outline" size={22} color="#fff" />
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
            onPress={handleNewConversation}
            accessibilityLabel="Nouvelle conversation"
          >
            <Ionicons name="add-circle-outline" size={22} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Contenu principal avec panneau historique overlay */}
      <View style={{ flex: 1 }}>
        {/* Backdrop sombre quand le panneau est ouvert */}
        {showHistory && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowHistory(false)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              zIndex: 10,
            }}
          />
        )}

        {/* Panneau historique lateral */}
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: PANEL_WIDTH,
            backgroundColor: "#1a1a1a",
            zIndex: 15,
            transform: [{ translateX: slideAnim }],
            borderRightWidth: 1,
            borderRightColor: "#333",
          }}
        >
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
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
              Historique
            </Text>
            <TouchableOpacity
              onPress={() => setShowHistory(false)}
              accessibilityLabel="Fermer l'historique"
            >
              <Ionicons name="close" size={22} color="#aaa" />
            </TouchableOpacity>
          </View>

          {/* Bouton nouvelle conversation */}
          <TouchableOpacity
            onPress={handleNewConversation}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginHorizontal: 12,
              marginTop: 12,
              marginBottom: 8,
              backgroundColor: "#00815d",
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 14,
            }}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
              Nouvelle conversation
            </Text>
          </TouchableOpacity>

          {/* Liste des conversations */}
          {loadingHistory ? (
            <View style={{ paddingTop: 40, alignItems: "center" }}>
              <ActivityIndicator size="small" color="#00c17c" />
              <Text style={{ color: "#888", fontSize: 13, marginTop: 8 }}>
                Chargement...
              </Text>
            </View>
          ) : conversations.length === 0 ? (
            <View style={{ paddingTop: 40, alignItems: "center", paddingHorizontal: 20 }}>
              <Ionicons name="chatbubbles-outline" size={32} color="#555" />
              <Text style={{ color: "#888", fontSize: 13, marginTop: 8, textAlign: "center" }}>
                Aucune conversation
              </Text>
            </View>
          ) : (
            <FlatList
              data={dateGroups}
              keyExtractor={(item) => item.label}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item: group }) => (
                <View>
                  {/* Label de date */}
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
                  {/* Items de conversation */}
                  {group.items.map((conv) => (
                    <TouchableOpacity
                      key={conv.id}
                      onPress={() => handleLoadConversation(conv.id)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        backgroundColor:
                          conv.id === conversationId ? "#2a2a2a" : "transparent",
                      }}
                    >
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            color: conv.id === conversationId ? "#00c17c" : "#ddd",
                            fontSize: 13,
                          }}
                        >
                          {conv.title || "Sans titre"}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDeleteConversation(conv.id, conv.title)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        accessibilityLabel="Supprimer"
                      >
                        <Ionicons name="trash-outline" size={16} color="#666" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
          )}
        </Animated.View>

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
                flexDirection: "row",
                alignItems: "flex-start",
                alignSelf: msg.role === "USER" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                gap: 8,
              }}
            >
              {/* Icône IA à gauche */}
              {msg.role === "ASSISTANT" && (
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: "#00c17c",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 2,
                  }}
                >
                  <Ionicons name="sparkles" size={16} color="#fff" />
                </View>
              )}
              <View style={{ flex: 1 }}>
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
              {/* Icône utilisateur à droite */}
              {msg.role === "USER" && (
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: "#1a1a1a",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 2,
                  }}
                >
                  <Ionicons name="person" size={16} color="#fff" />
                </View>
              )}
            </View>
          ))}

          {/* Message en cours de streaming */}
          {isStreaming && (
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
                  borderRadius: 15,
                  backgroundColor: "#00c17c",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 2,
                }}
              >
                <Ionicons name="sparkles" size={16} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
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
                        Réflexion en cours...
                      </Text>
                    </View>
                  )}
                </View>
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
            CGI 242 peut faire des erreurs. Vérifiez les informations importantes.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
