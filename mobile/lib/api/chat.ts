// mobile/lib/api/chat.ts
// Client API chat IA fiscal - SSE streaming + CRUD conversations

import { api } from "./client";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3003/api";

// --- Types ---

export interface ChatMessage {
  id: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
  content: string;
  tokensUsed?: number;
  responseTime?: number;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { messages: number };
  messages?: ChatMessage[];
}

export interface Citation {
  articleNumber: string;
  titre?: string;
  excerpt: string;
  score: number;
}

export interface StreamCallbacks {
  onConversation?: (conversationId: string) => void;
  onChunk?: (text: string) => void;
  onCitations?: (citations: Citation[]) => void;
  onDone?: (metadata: { messageId: string; tokensUsed: number; responseTime: number }) => void;
  onError?: (error: string) => void;
}

// --- Helpers pour lire le token ---

async function getAuthToken(): Promise<string | null> {
  if (typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
    return sessionStorage.getItem("accessToken");
  }
  const { getItemAsync } = require("expo-secure-store");
  return getItemAsync("accessToken");
}

// --- SSE Streaming ---

/**
 * Envoyer un message avec streaming SSE
 * Utilise fetch natif pour lire le stream de reponse
 */
export async function sendMessageStream(
  content: string,
  conversationId?: string,
  callbacks?: StreamCallbacks
): Promise<void> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/chat/message/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ content, conversationId }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMsg = "Erreur serveur";
    try {
      const parsed = JSON.parse(errorText);
      errorMsg = parsed.error || errorMsg;
    } catch {
      // ignore parse error
    }
    callbacks?.onError?.(errorMsg);
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    callbacks?.onError?.("Streaming non supporte");
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    let currentEvent = "";
    for (const line of lines) {
      if (line.startsWith("event: ")) {
        currentEvent = line.slice(7).trim();
      } else if (line.startsWith("data: ")) {
        const dataStr = line.slice(6);
        try {
          const data = JSON.parse(dataStr);

          switch (currentEvent) {
            case "conversation":
              callbacks?.onConversation?.(data.conversationId);
              break;
            case "chunk":
              callbacks?.onChunk?.(data.text);
              break;
            case "citations":
              callbacks?.onCitations?.(data.citations);
              break;
            case "done":
              callbacks?.onDone?.(data);
              break;
            case "error":
              callbacks?.onError?.(data.error);
              break;
          }
        } catch {
          // ignore parse errors on incomplete data
        }
        currentEvent = "";
      }
    }
  }
}

// --- CRUD Conversations (via axios) ---

/**
 * Lister les conversations de l'utilisateur
 */
export async function getConversations(): Promise<Conversation[]> {
  const { data } = await api.get<{ conversations: Conversation[] }>("/chat/conversations");
  return data.conversations;
}

/**
 * Recuperer une conversation avec ses messages
 */
export async function getConversation(id: string): Promise<Conversation & { messages: ChatMessage[] }> {
  const { data } = await api.get<{ conversation: Conversation & { messages: ChatMessage[] } }>(
    `/chat/conversations/${id}`
  );
  return data.conversation;
}

/**
 * Supprimer une conversation
 */
export async function deleteConversation(id: string): Promise<void> {
  await api.delete(`/chat/conversations/${id}`);
}
