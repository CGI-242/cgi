import { Router, Response } from "express";
import prisma from "../utils/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { createLogger } from "../utils/logger";

const logger = createLogger("UserRoutes");
const router = Router();

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     tags: [User]
 *     summary: Profil de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 */
router.get("/profile", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profession: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "Utilisateur introuvable" });
      return;
    }

    // Récupérer l'abonnement via l'organisation
    const membership = await prisma.organizationMember.findFirst({
      where: { userId: req.userId },
      include: {
        organization: {
          include: {
            subscription: true,
          },
        },
      },
    });

    const subscription = membership?.organization?.subscription;

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        profession: user.profession,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      subscription: subscription
        ? {
            plan: subscription.plan,
            status: subscription.status,
            questionsPerMonth: subscription.questionsPerMonth,
            questionsUsed: membership?.questionsUsed ?? 0,
            currentPeriodEnd: subscription.currentPeriodEnd,
          }
        : null,
    });
  } catch (err) {
    logger.error("[get-profile]", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     tags: [User]
 *     summary: Mise à jour du profil utilisateur
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               profession:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil mis à jour
 */
router.put("/profile", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, phone, profession } = req.body;

    // Validation basique
    if (firstName !== undefined && (typeof firstName !== "string" || firstName.trim().length === 0)) {
      res.status(400).json({ error: "Le prénom est invalide" });
      return;
    }
    if (lastName !== undefined && (typeof lastName !== "string" || lastName.trim().length === 0)) {
      res.status(400).json({ error: "Le nom est invalide" });
      return;
    }
    if (phone !== undefined && phone !== null && typeof phone !== "string") {
      res.status(400).json({ error: "Le téléphone est invalide" });
      return;
    }
    if (profession !== undefined && profession !== null && typeof profession !== "string") {
      res.status(400).json({ error: "La profession est invalide" });
      return;
    }

    // Construire l'objet de mise à jour avec uniquement les champs fournis
    const data: Record<string, string | null> = {};
    if (firstName !== undefined) data.firstName = firstName.trim();
    if (lastName !== undefined) data.lastName = lastName.trim();
    if (phone !== undefined) data.phone = phone ? phone.trim() : null;
    if (profession !== undefined) data.profession = profession ? profession.trim() : null;

    if (Object.keys(data).length === 0) {
      res.status(400).json({ error: "Aucun champ à mettre à jour" });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profession: true,
        avatar: true,
        createdAt: true,
      },
      data,
    });

    res.json({ user: updated });
  } catch (err) {
    logger.error("[update-profile]", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
