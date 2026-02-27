import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { resolveTenant, requireOrg } from '../middleware/tenant.middleware';
import { requireOwner, requireAdmin } from '../middleware/orgRole.middleware';
import { AuditService } from '../services/audit.service';

const router = Router();

// GET /api/audit/organization
router.get('/organization', requireAuth, resolveTenant, requireOrg, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const action = req.query.action as string | undefined;
    const result = await AuditService.getOrganizationAudit(req.orgId!, { page, limit, action });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/audit/user/:userId
router.get('/user/:userId', requireAuth, resolveTenant, requireOrg, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const result = await AuditService.getUserActions(userId, { page, limit });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/audit/entity/:type/:id
router.get('/entity/:type/:id', requireAuth, resolveTenant, requireOrg, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const type = Array.isArray(req.params.type) ? req.params.type[0] : req.params.type;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const logs = await AuditService.getEntityHistory(type, id);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/audit/search
router.get('/search', requireAuth, resolveTenant, requireOrg, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const result = await AuditService.search(req.orgId!, {
      action: req.query.action as string,
      actorId: req.query.actorId as string,
      entityType: req.query.entityType as string,
      from: req.query.from as string,
      to: req.query.to as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 50,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/audit/stats
router.get('/stats', requireAuth, resolveTenant, requireOrg, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const stats = await AuditService.getStats(req.orgId!, days);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/audit/cleanup — GDPR cleanup
router.post('/cleanup', requireAuth, resolveTenant, requireOrg, requireOwner, async (req: AuthRequest, res: Response) => {
  try {
    const olderThanDays = parseInt(req.body.olderThanDays as string) || 365;
    const result = await AuditService.gdprCleanup(req.orgId!, olderThanDays);
    AuditService.log({ actorId: req.userId!, actorEmail: req.userEmail!, action: 'DATA_EXPORTED', entityType: 'AuditLog', entityId: req.orgId!, organizationId: req.orgId!, changes: { type: 'gdpr_cleanup', deleted: result.deleted } });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
