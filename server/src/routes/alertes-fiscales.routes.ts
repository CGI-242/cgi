import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { resolveTenant, requireOrg } from '../middleware/tenant.middleware';
import { requireAdmin } from '../middleware/orgRole.middleware';
import * as alertesService from '../services/alertes-fiscales.service';

const router = Router();

// GET /api/alertes-fiscales
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const result = await alertesService.getAllAlertes({
      type: req.query.type as string,
      categorie: req.query.categorie as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 100,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/alertes-fiscales/stats
router.get('/stats', requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const stats = await alertesService.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/alertes-fiscales/article/:n
router.get('/article/:n', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const n = Array.isArray(req.params.n) ? req.params.n[0] : req.params.n;
    const alertes = await alertesService.getByArticle(n);
    res.json(alertes);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/alertes-fiscales/extract — seed + extract
router.post('/extract', requireAuth, resolveTenant, requireOrg, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    if (req.body.seed) {
      const result = await alertesService.seedPredefinedAlertes();
      res.json(result);
      return;
    }
    if (req.body.text) {
      const extractions = await alertesService.extractFromText(req.body.text);
      res.json({ extractions });
      return;
    }
    res.status(400).json({ error: 'Paramètre "seed" ou "text" requis' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
