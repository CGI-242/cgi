import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { resolveTenant, requireOrg } from '../middleware/tenant.middleware';
import { requireOwner, requireAdmin, requireMember } from '../middleware/orgRole.middleware';
import * as orgService from '../services/organization.service';
import * as orgAdminService from '../services/organization.admin.service';
import { AuditService } from '../services/audit.service';

const router = Router();

function handleError(res: Response, err: unknown) {
  const msg = err instanceof Error ? err.message : 'Erreur serveur';
  if (msg.includes('introuvable')) { res.status(404).json({ error: msg }); return; }
  if (msg.includes('déjà') || msg.includes('Limite') || msg.includes('Impossible') || msg.includes('Seul')) { res.status(400).json({ error: msg }); return; }
  res.status(500).json({ error: 'Erreur serveur' });
}

// GET /api/organizations — liste des orgas du user
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const orgs = await orgService.getUserOrganizations(req.userId!);
    res.json(orgs);
  } catch (err) { handleError(res, err); }
});

// POST /api/organizations — créer une organisation
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const org = await orgService.createOrganization(req.userId!, req.userEmail!, req.body);
    AuditService.log({ actorId: req.userId!, actorEmail: req.userEmail!, action: 'ORG_CREATED', entityType: 'Organization', entityId: org.id, organizationId: org.id, changes: { after: { name: org.name, slug: org.slug } } });
    res.status(201).json(org);
  } catch (err) { handleError(res, err); }
});

// GET /api/organizations/:id
router.get('/:id', requireAuth, resolveTenant, requireOrg, requireMember, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const org = await orgService.getOrganizationById(id);
    res.json(org);
  } catch (err) { handleError(res, err); }
});

// PUT /api/organizations/:id
router.put('/:id', requireAuth, resolveTenant, requireOrg, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await orgService.updateOrganization(id, req.body);
    AuditService.log({ actorId: req.userId!, actorEmail: req.userEmail!, action: 'ORG_UPDATED', entityType: 'Organization', entityId: id, organizationId: id, changes: result });
    res.json(result.after);
  } catch (err) { handleError(res, err); }
});

// DELETE /api/organizations/:id — soft delete
router.delete('/:id', requireAuth, resolveTenant, requireOrg, requireOwner, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await orgAdminService.softDeleteOrganization(id, req.userId!);
    AuditService.log({ actorId: req.userId!, actorEmail: req.userEmail!, action: 'ORG_DELETED', entityType: 'Organization', entityId: id, organizationId: id, changes: { deletedBy: req.userId } });
    res.json({ message: 'Organisation supprimée' });
  } catch (err) { handleError(res, err); }
});

// GET /api/organizations/:id/members
router.get('/:id/members', requireAuth, resolveTenant, requireOrg, requireMember, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const members = await orgService.getMembers(id);
    res.json(members);
  } catch (err) { handleError(res, err); }
});

// POST /api/organizations/:id/members/invite
router.post('/:id/members/invite', requireAuth, resolveTenant, requireOrg, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const invitation = await orgService.inviteMember(id, req.userId!, req.body.email, req.body.role);
    AuditService.log({ actorId: req.userId!, actorEmail: req.userEmail!, action: 'MEMBER_INVITED', entityType: 'Invitation', entityId: invitation.id, organizationId: id, changes: { email: req.body.email, role: req.body.role } });
    res.status(201).json(invitation);
  } catch (err) { handleError(res, err); }
});

// DELETE /api/organizations/:id/members/:userId
router.delete('/:id/members/:userId', requireAuth, resolveTenant, requireOrg, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    await orgService.removeMember(id, userId);
    AuditService.log({ actorId: req.userId!, actorEmail: req.userEmail!, action: 'MEMBER_REMOVED', entityType: 'OrganizationMember', entityId: userId, organizationId: id, changes: { removedUserId: userId } });
    res.json({ message: 'Membre retiré' });
  } catch (err) { handleError(res, err); }
});

// PUT /api/organizations/:id/members/:userId/role
router.put('/:id/members/:userId/role', requireAuth, resolveTenant, requireOrg, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const updated = await orgService.changeMemberRole(id, userId, req.body.role);
    AuditService.log({ actorId: req.userId!, actorEmail: req.userEmail!, action: 'MEMBER_ROLE_CHANGED', entityType: 'OrganizationMember', entityId: userId, organizationId: id, changes: { newRole: req.body.role } });
    res.json(updated);
  } catch (err) { handleError(res, err); }
});

// POST /api/organizations/:id/transfer-ownership
router.post('/:id/transfer-ownership', requireAuth, resolveTenant, requireOrg, requireOwner, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await orgService.transferOwnership(id, req.userId!, req.body.newOwnerId);
    AuditService.log({ actorId: req.userId!, actorEmail: req.userEmail!, action: 'OWNERSHIP_TRANSFERRED', entityType: 'Organization', entityId: id, organizationId: id, changes: { from: req.userId, to: req.body.newOwnerId } });
    res.json({ message: 'Propriété transférée' });
  } catch (err) { handleError(res, err); }
});

// GET /api/organizations/:id/invitations
router.get('/:id/invitations', requireAuth, resolveTenant, requireOrg, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const invitations = await orgService.getInvitations(id);
    res.json(invitations);
  } catch (err) { handleError(res, err); }
});

// DELETE /api/organizations/:id/invitations/:invId
router.delete('/:id/invitations/:invId', requireAuth, resolveTenant, requireOrg, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const invId = Array.isArray(req.params.invId) ? req.params.invId[0] : req.params.invId;
    await orgService.cancelInvitation(id, invId);
    res.json({ message: 'Invitation annulée' });
  } catch (err) { handleError(res, err); }
});

// POST /api/organizations/accept-invitation — auth only, pas d'org
router.post('/accept-invitation', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const result = await orgService.acceptInvitation(req.userId!, req.body.token);
    AuditService.log({ actorId: req.userId!, actorEmail: req.userEmail!, action: 'MEMBER_JOINED', entityType: 'Organization', entityId: result.organizationId, organizationId: result.organizationId, changes: { role: result.role } });
    res.json(result);
  } catch (err) { handleError(res, err); }
});

// POST /api/organizations/:id/restore
router.post('/:id/restore', requireAuth, resolveTenant, requireOrg, requireOwner, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await orgAdminService.restoreOrganization(id);
    AuditService.log({ actorId: req.userId!, actorEmail: req.userEmail!, action: 'ORG_RESTORED', entityType: 'Organization', entityId: id, organizationId: id, changes: {} });
    res.json({ message: 'Organisation restaurée' });
  } catch (err) { handleError(res, err); }
});

// DELETE /api/organizations/:id/permanent — hard delete
router.delete('/:id/permanent', requireAuth, resolveTenant, requireOrg, requireOwner, async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await orgAdminService.hardDeleteOrganization(id);
    res.json({ message: 'Organisation supprimée définitivement' });
  } catch (err) { handleError(res, err); }
});

export default router;
