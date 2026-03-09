import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { validate } from "../middleware/validate.middleware";
import { registerPushBody, unregisterPushBody } from "../schemas/notifications.schema";
import { PushService } from "../services/push.service";

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
router.post("/register", requireAuth, validate({ body: registerPushBody }), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { token, platform } = req.body;
  await PushService.registerToken(req.userId!, token, platform || "unknown");
  res.json({ message: "Token enregistré" });
}));

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
router.delete("/unregister", requireAuth, validate({ body: unregisterPushBody }), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { token } = req.body;
  await PushService.unregisterToken(token);
  res.json({ message: "Token supprimé" });
}));

export default router;
