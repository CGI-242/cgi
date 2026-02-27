import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { resolveTenant, requireOrg } from '../middleware/tenant.middleware';
import { requireOwner, requireAdmin } from '../middleware/orgRole.middleware';
import * as permissionService from '../services/permission.service';
import { AuditService } from '../services/audit.service';
import { Permission } from '../types/permissions';

const router = Router();

function handleError(res: Response, err: unknown) {
  const msg = err instanceof Error ? err.message : 'Erreur serveur';
  if (msg.includes('introuvable')) { res.status(404).json({ error: msg }); return; }
  if (msg.includes('propriétaire')) { res.status(400).json({ error: msg }); return; }
  res.status(500).json({ error: 'Erreur serveur' });
}

// GET /api/permissions/available
router.get('/available', requireAuth, async (_req: AuthRequest, res: Response) => {
  res.json(permissionService.listAvailable());
});

// GET /api/permissions/my — mes permissions
router.get('/my', requireAuth, resolveTenant, requireOrg, async (req: AuthRequest, res: Response) => {
  try {
    const perms = await permissionService.getEffectivePermissions(req.orgId!, req.userId!);
    res.json({ role: req.orgRole, permissions: perms });
  } catch (err) { handleError(res, err); }
});

// GET /api/permissions/check/:permission
router.get('/check/:permission', requireAuth, resolveTenant, requireOrg, async (req: AuthRequest, res: Response) => {
  try {
    const permission = Array.isArray(req.params.permission) ? req.params.permission[0] : req.params.permission;
    const has = await permissionService.hasPermission(req.orgId!, req.userId!, permission as Permission);
    res.json({ permission, granted: has });
  } catch (err) { handleError(res, err); }
});

// GET /api/permissions/members/:userId
router.get('/members/:userId', requireAuth, resolveTenant, requireOrg, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const perms = await permissionService.getMemberPermissions(req.orgId!, userId);
    res.json(perms);
  } catch (err) { handleError(res, err); }
});

// GET /api/permissions/members/:userId/effective
router.get('/members/:userId/effective', requireAuth, resolveTenant, requireOrg, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const perms = await permissionService.getEffectivePermissions(req.orgId!, userId);
    res.json(perms);
  } catch (err) { handleError(res, err); }
});

// POST /api/permissions/members/:userId/grant
router.post('/members/:userId/grant', requireAuth, resolveTenant, requireOrg, requireOwner, async (req: AuthRequest, res: Response) => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    await permissionService.grantPermission(req.orgId!, userId, req.body.permission);
    AuditService.log({ actorId: req.userId!, actorEmail: req.userEmail!, action: 'PERMISSION_GRANTED', entityType: 'OrganizationMember', entityId: userId, organizationId: req.orgId!, changes: { permission: req.body.permission } });
    res.json({ message: 'Permission accordée' });
  } catch (err) { handleError(res, err); }
});

// POST /api/permissions/members/:userId/revoke
router.post('/members/:userId/revoke', requireAuth, resolveTenant, requireOrg, requireOwner, async (req: AuthRequest, res: Response) => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    await permissionService.revokePermission(req.orgId!, userId, req.body.permission);
    AuditService.log({ actorId: req.userId!, actorEmail: req.userEmail!, action: 'PERMISSION_REVOKED', entityType: 'OrganizationMember', entityId: userId, organizationId: req.orgId!, changes: { permission: req.body.permission } });
    res.json({ message: 'Permission révoquée' });
  } catch (err) { handleError(res, err); }
});

// POST /api/permissions/members/:userId/reset
router.post('/members/:userId/reset', requireAuth, resolveTenant, requireOrg, requireOwner, async (req: AuthRequest, res: Response) => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    await permissionService.resetToDefaults(req.orgId!, userId);
    AuditService.log({ actorId: req.userId!, actorEmail: req.userEmail!, action: 'PERMISSIONS_RESET', entityType: 'OrganizationMember', entityId: userId, organizationId: req.orgId!, changes: {} });
    res.json({ message: 'Permissions réinitialisées' });
  } catch (err) { handleError(res, err); }
});

export default router;
