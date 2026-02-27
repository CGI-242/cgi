import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { resolveTenant, requireOrg } from '../middleware/tenant.middleware';
import { requireOwner } from '../middleware/orgRole.middleware';
import * as subscriptionService from '../services/subscription.service';
import { AuditService } from '../services/audit.service';
import { PlanName } from '../types/plans';
import { createLogger } from '../utils/logger';

const logger = createLogger('SubscriptionRoutes');
const router = Router();

const VALID_PAID_PLANS: PlanName[] = ['BASIQUE', 'PRO'];

// GET /api/subscription — status de l'abonnement
router.get('/', requireAuth, resolveTenant, requireOrg, async (req: AuthRequest, res: Response) => {
  try {
    const sub = await subscriptionService.getSubscription(req.orgId!);
    res.json(sub);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur serveur';
    if (msg.includes('introuvable')) { res.status(404).json({ error: msg }); return; }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/subscription/activate — Activation manuelle après paiement (OWNER only)
router.post('/activate', requireAuth, resolveTenant, requireOrg, requireOwner, async (req: AuthRequest, res: Response) => {
  try {
    const { plan } = req.body;

    if (!plan || !VALID_PAID_PLANS.includes(plan)) {
      res.status(400).json({ error: `Plan invalide. Plans disponibles : ${VALID_PAID_PLANS.join(', ')}` });
      return;
    }

    const updated = await subscriptionService.activateSubscription(req.orgId!, plan);

    AuditService.log({
      actorId: req.userId!,
      actorEmail: req.userEmail!,
      action: 'SUBSCRIPTION_CREATED',
      entityType: 'Subscription',
      entityId: updated.id,
      organizationId: req.orgId!,
      changes: { plan, activatedUntil: updated.currentPeriodEnd },
    });

    res.json({
      message: `Abonnement ${plan} activé pour 1 an`,
      subscription: updated,
    });
  } catch (err) {
    logger.error('Erreur activation abonnement', err);
    const msg = err instanceof Error ? err.message : 'Erreur serveur';
    if (msg.includes('introuvable') || msg.includes('gratuit')) { res.status(400).json({ error: msg }); return; }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/subscription/renew — Renouvellement après paiement (OWNER only)
router.post('/renew', requireAuth, resolveTenant, requireOrg, requireOwner, async (req: AuthRequest, res: Response) => {
  try {
    const updated = await subscriptionService.renewSubscription(req.orgId!);

    AuditService.log({
      actorId: req.userId!,
      actorEmail: req.userEmail!,
      action: 'SUBSCRIPTION_UPDATED',
      entityType: 'Subscription',
      entityId: updated.id,
      organizationId: req.orgId!,
      changes: { action: 'renew', renewedUntil: updated.currentPeriodEnd },
    });

    res.json({
      message: 'Abonnement renouvelé pour 1 an',
      subscription: updated,
    });
  } catch (err) {
    logger.error('Erreur renouvellement', err);
    const msg = err instanceof Error ? err.message : 'Erreur serveur';
    if (msg.includes('introuvable') || msg.includes('gratuit')) { res.status(400).json({ error: msg }); return; }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/subscription/upgrade — Changer de plan
router.post('/upgrade', requireAuth, resolveTenant, requireOrg, requireOwner, async (req: AuthRequest, res: Response) => {
  try {
    const updated = await subscriptionService.upgradePlan(req.orgId!, req.body.plan);
    AuditService.log({ actorId: req.userId!, actorEmail: req.userEmail!, action: 'SUBSCRIPTION_UPDATED', entityType: 'Subscription', entityId: updated.id, organizationId: req.orgId!, changes: { newPlan: req.body.plan } });
    res.json(updated);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur serveur';
    if (msg.includes('introuvable')) { res.status(404).json({ error: msg }); return; }
    if (msg.includes('supérieur') || msg.includes('déjà')) { res.status(400).json({ error: msg }); return; }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/subscription/quota — Statut du quota
router.get('/quota', requireAuth, resolveTenant, requireOrg, async (req: AuthRequest, res: Response) => {
  try {
    const quota = await subscriptionService.checkQuota(req.orgId!, req.userId);
    res.json(quota);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur serveur';
    if (msg.includes('introuvable')) { res.status(404).json({ error: msg }); return; }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
