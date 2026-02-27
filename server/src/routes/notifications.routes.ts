import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { PushService } from "../services/push.service";
import { createLogger } from "../utils/logger";

const logger = createLogger("NotificationRoutes");
const router = Router();

/**
 * @swagger
 * /notifications/register:
 *   post:
 *     tags: [Notifications]
 *     summary: Enregistrer un token push
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token:
 *                 type: string
 *               platform:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token enregistré
 *       400:
 *         description: Token manquant
 */
router.post("/register", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { token, platform } = req.body;
    if (!token) {
      res.status(400).json({ error: "Token push requis" });
      return;
    }
    await PushService.registerToken(req.userId!, token, platform || "unknown");
    res.json({ message: "Token enregistré" });
  } catch (err) {
    logger.error("[register-push]", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /notifications/unregister:
 *   delete:
 *     tags: [Notifications]
 *     summary: Supprimer un token push
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token supprimé
 */
router.delete("/unregister", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ error: "Token push requis" });
      return;
    }
    await PushService.unregisterToken(token);
    res.json({ message: "Token supprimé" });
  } catch (err) {
    logger.error("[unregister-push]", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
