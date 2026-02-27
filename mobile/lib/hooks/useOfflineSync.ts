import { useEffect, useRef } from "react";
import { useOnlineStatus } from "./useOnlineStatus";
import { useOfflineQueue } from "../store/offlineQueue";

export function useOfflineSync() {
  const isOnline = useOnlineStatus();
  const queue = useOfflineQueue((s) => s.queue);
  const removeMessage = useOfflineQueue((s) => s.removeMessage);
  const setStatus = useOfflineQueue((s) => s.setStatus);
  const isSyncing = useRef(false);

  useEffect(() => {
    if (!isOnline || isSyncing.current) return;

    const pendingMessages = queue.filter((m) => m.status === "pending");
    if (pendingMessages.length === 0) return;

    isSyncing.current = true;

    (async () => {
      for (const msg of pendingMessages) {
        try {
          setStatus(msg.id, "sending");

          // Dynamic import to avoid circular dependency
          const { sendMessageStream } = await import("../api/chat");
          await sendMessageStream(msg.content, msg.conversationId);

          removeMessage(msg.id);
        } catch {
          setStatus(msg.id, "failed");
        }
      }
      isSyncing.current = false;
    })();
  }, [isOnline, queue, removeMessage, setStatus]);
}
