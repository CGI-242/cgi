import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type QueuedMessage = {
  id: string;
  content: string;
  conversationId?: string;
  queuedAt: number;
  status: "pending" | "sending" | "failed";
};

type OfflineQueueState = {
  queue: QueuedMessage[];
  addMessage: (content: string, conversationId?: string) => void;
  removeMessage: (id: string) => void;
  setStatus: (id: string, status: QueuedMessage["status"]) => void;
  clearQueue: () => void;
};

export const useOfflineQueue = create<OfflineQueueState>()(
  persist(
    (set) => ({
      queue: [],
      addMessage: (content, conversationId) =>
        set((state) => ({
          queue: [
            ...state.queue,
            {
              id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
              content,
              conversationId,
              queuedAt: Date.now(),
              status: "pending",
            },
          ],
        })),
      removeMessage: (id) =>
        set((state) => ({
          queue: state.queue.filter((m) => m.id !== id),
        })),
      setStatus: (id, status) =>
        set((state) => ({
          queue: state.queue.map((m) =>
            m.id === id ? { ...m, status } : m
          ),
        })),
      clearQueue: () => set({ queue: [] }),
    }),
    {
      name: "cgi242-offline-queue",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
