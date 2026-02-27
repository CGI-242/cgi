import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';
import * as subscriptionService from '../services/subscription.service';
import { PlanName, calculateTotalPrice, getUnitPrice } from '../types/plans';
import { createLogger } from '../utils/logger';

const logger = createLogger('AdminRoutes');
const router = Router();

const VALID_PAID_PLANS: PlanName[] = ['BASIQUE', 'PRO'];

/**
 * Middleware admin : verifie que l'utilisateur authentifie est l'admin
 * declare dans la variable d'environnement ADMIN_EMAIL.
 */
function requireAdmin(req: AuthRequest, res: Response, next: () => void) {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    logger.warn('ADMIN_EMAIL non configure dans les variables d\'environnement');
    res.status(503).json({ error: 'Administration non configuree' });
    return;
  }

  if (req.userEmail !== adminEmail) {
    logger.warn(`Tentative d'acces admin refusee pour ${req.userEmail}`);
    res.status(403).json({ error: 'Acces refuse — droits administrateur requis' });
    return;
  }

  next();
}

/**
 * @swagger
 * /api/admin/organizations:
 *   get:
 *     tags: [Admin]
 *     summary: Liste de toutes les organisations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des organisations avec abonnements et membres
 */
router.get('/organizations', requireAuth, requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const organizations = await prisma.organization.findMany({
      where: { deletedAt: null },
      include: {
        subscription: true,
        _count: {
          select: { members: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const result = organizations.map((org) => {
      const memberCount = org._count.members;
      const plan = (org.subscription?.plan || 'FREE') as PlanName;
      return {
        id: org.id,
        name: org.name,
        slug: org.slug,
        createdAt: org.createdAt,
        memberCount,
        totalPrice: calculateTotalPrice(plan, memberCount),
        unitPrice: getUnitPrice(plan, memberCount),
        subscription: org.subscription
          ? {
              id: org.subscription.id,
              plan: org.subscription.plan,
              status: org.subscription.status,
              questionsUsed: org.subscription.questionsUsed,
              questionsPerMonth: org.subscription.questionsPerMonth,
              maxMembers: org.subscription.maxMembers,
              currentPeriodStart: org.subscription.currentPeriodStart,
              currentPeriodEnd: org.subscription.currentPeriodEnd,
              trialEndsAt: org.subscription.trialEndsAt,
            }
          : null,
      };
    });

    logger.info(`Liste admin : ${result.length} organisations`);
    res.json(result);
  } catch (err) {
    logger.error('Erreur lors de la recuperation des organisations', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * @swagger
 * /api/admin/organizations/{orgId}/activate:
 *   post:
 *     tags: [Admin]
 *     summary: Activer l'abonnement d'une organisation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plan:
 *                 type: string
 *                 enum: [BASIQUE, PRO]
 *     responses:
 *       200:
 *         description: Abonnement activé
 */
router.post('/organizations/:orgId/activate', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const orgId = Array.isArray(req.params.orgId) ? req.params.orgId[0] : req.params.orgId;
    const { plan } = req.body;

    if (!plan || !VALID_PAID_PLANS.includes(plan)) {
      res.status(400).json({ error: `Plan invalide. Plans disponibles : ${VALID_PAID_PLANS.join(', ')}` });
      return;
    }

    const updated = await subscriptionService.activateSubscription(orgId, plan);
    logger.info(`Admin ${req.userEmail} a active le plan ${plan} pour l'org ${orgId}`);

    res.json({
      message: `Abonnement ${plan} active pour 1 an`,
      subscription: updated,
    });
  } catch (err) {
    logger.error('Erreur activation abonnement (admin)', err);
    const msg = err instanceof Error ? err.message : 'Erreur serveur';
    if (msg.includes('introuvable') || msg.includes('gratuit')) {
      res.status(400).json({ error: msg });
      return;
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * @swagger
 * /api/admin/organizations/{orgId}/renew:
 *   post:
 *     tags: [Admin]
 *     summary: Renouveler l'abonnement d'une organisation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Abonnement renouvelé
 */
router.post('/organizations/:orgId/renew', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const orgId = Array.isArray(req.params.orgId) ? req.params.orgId[0] : req.params.orgId;

    const updated = await subscriptionService.renewSubscription(orgId);
    logger.info(`Admin ${req.userEmail} a renouvele l'abonnement pour l'org ${orgId}`);

    res.json({
      message: 'Abonnement renouvele pour 1 an',
      subscription: updated,
    });
  } catch (err) {
    logger.error('Erreur renouvellement abonnement (admin)', err);
    const msg = err instanceof Error ? err.message : 'Erreur serveur';
    if (msg.includes('introuvable') || msg.includes('gratuit')) {
      res.status(400).json({ error: msg });
      return;
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
