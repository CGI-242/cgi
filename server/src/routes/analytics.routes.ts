import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { resolveTenant, requireOrg } from '../middleware/tenant.middleware';
import { requireAdmin, requireMember } from '../middleware/orgRole.middleware';
import * as analyticsService from '../services/analytics.service';

const router = Router();

// GET /api/analytics/dashboard
router.get('/dashboard', requireAuth, resolveTenant, requireOrg, requireMember, async (req: AuthRequest, res: Response) => {
  try {
    const dashboard = await analyticsService.getDashboard(req.orgId!);
    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/analytics/timeseries
router.get('/timeseries', requireAuth, resolveTenant, requireOrg, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const data = await analyticsService.getTimeSeries(req.orgId!, days);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/analytics/members
router.get('/members', requireAuth, resolveTenant, requireOrg, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const stats = await analyticsService.getMemberStats(req.orgId!);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/analytics/export
router.get('/export', requireAuth, resolveTenant, requireOrg, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const csv = await analyticsService.exportCsv(req.orgId!, days);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=analytics-${req.orgId}.csv`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
