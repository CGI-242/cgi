// server/src/routes/chat.ts
// Routes chat IA fiscal - SSE streaming + CRUD conversations

import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";
import * as chatService from "../services/chat.service";

const router = Router();

// POST /api/chat/message/stream — Envoyer un message avec streaming SSE
router.post("/message/stream", requireAuth, async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { content, conversationId } = req.body;

  if (!content || typeof content !== "string" || !content.trim()) {
    res.status(400).json({ error: "Le contenu du message est requis" });
    return;
  }

  // Configurer SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  try {
    const stream = chatService.sendMessageStream(userId, content.trim(), conversationId);

    for await (const event of stream) {
      res.write(`event: ${event.event}\ndata: ${event.data}\n\n`);
    }

    res.write("event: close\ndata: {}\n\n");
    res.end();
  } catch (err) {
    console.error("[chat/stream]", err);
    const message = err instanceof Error ? err.message : "Erreur serveur";
    res.write(`event: error\ndata: ${JSON.stringify({ error: message })}\n\n`);
    res.end();
  }
});

// GET /api/chat/conversations — Lister les conversations
router.get("/conversations", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const conversations = await chatService.getConversations(req.userId!);
    res.json({ conversations });
  } catch (err) {
    console.error("[chat/conversations]", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /api/chat/conversations/:id — Recuperer une conversation avec messages
router.get("/conversations/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const conversation = await chatService.getConversation(req.userId!, id);
    res.json({ conversation });
  } catch (err) {
    console.error("[chat/conversation]", err);
    const message = err instanceof Error ? err.message : "Erreur serveur";
    if (message === "Conversation introuvable") {
      res.status(404).json({ error: message });
      return;
    }
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /api/chat/conversations/:id — Supprimer une conversation
router.delete("/conversations/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await chatService.deleteConversation(req.userId!, id);
    res.json({ message: "Conversation supprimee" });
  } catch (err) {
    console.error("[chat/delete]", err);
    const message = err instanceof Error ? err.message : "Erreur serveur";
    if (message === "Conversation introuvable") {
      res.status(404).json({ error: message });
      return;
    }
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
