import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { resolveTenant, requireOrg } from '../middleware/tenant.middleware';
import { requireAdmin, requireMember } from '../middleware/orgRole.middleware';
import { validate } from '../middleware/validate.middleware';
import { daysQuery } from '../schemas/analytics.schema';
import * as analyticsService from '../services/analytics.service';

const router = Router();

/**
 * @swagger
 * /api/analytics/dashboard:
 *   get:
 *     tags: [Analytics]
 *     summary: Obtenir les données du tableau de bord
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Données du tableau de bord
 */
// GET /api/analytics/dashboard
router.get('/dashboard', requireAuth, resolveTenant, requireOrg, requireMember, async (req: AuthRequest, res: Response) => {
  try {
    const dashboard = await analyticsService.getDashboard(req.orgId!);
    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * @swagger
 * /api/analytics/timeseries:
 *   get:
 *     tags: [Analytics]
 *     summary: Obtenir les données de série temporelle
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: number
 *           default: 30
 *         description: Nombre de jours à inclure
 *     responses:
 *       200:
 *         description: Données de série temporelle
 */
// GET /api/analytics/timeseries
router.get('/timeseries', requireAuth, resolveTenant, requireOrg, requireAdmin, validate({ query: daysQuery }), async (req: AuthRequest, res: Response) => {
  try {
    const days = Number(req.query.days);
    const data = await analyticsService.getTimeSeries(req.orgId!, days);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * @swagger
 * /api/analytics/members:
 *   get:
 *     tags: [Analytics]
 *     summary: Obtenir les statistiques des membres
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques des membres
 */
// GET /api/analytics/members
router.get('/members', requireAuth, resolveTenant, requireOrg, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const stats = await analyticsService.getMemberStats(req.orgId!);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * @swagger
 * /api/analytics/export:
 *   get:
 *     tags: [Analytics]
 *     summary: Exporter les données en CSV
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: number
 *           default: 30
 *         description: Nombre de jours à inclure
 *     responses:
 *       200:
 *         description: Fichier CSV exporté
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
// GET /api/analytics/export
router.get('/export', requireAuth, resolveTenant, requireOrg, requireAdmin, validate({ query: daysQuery }), async (req: AuthRequest, res: Response) => {
  try {
    const days = Number(req.query.days);
    const csv = await analyticsService.exportCsv(req.orgId!, days);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=analytics-${req.orgId}.csv`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
