import prisma from '../utils/prisma';
import { createLogger } from '../utils/logger';
import { Permission, PermissionMap, ROLE_DEFAULTS, OrgRole, getAllPermissions } from '../types/permissions';
import { cacheService, CACHE_PREFIX } from '../utils/cache';

const logger = createLogger('PermissionService');

export async function hasPermission(orgId: string, userId: string, permission: Permission): Promise<boolean> {
  const effective = await getEffectivePermissions(orgId, userId);
  return effective[permission] === true;
}

export async function getEffectivePermissions(orgId: string, userId: string): Promise<PermissionMap> {
  const member = await prisma.organizationMember.findUnique({
    where: { userId_organizationId: { userId, organizationId: orgId } },
  });
  if (!member) throw new Error('Membre introuvable');

  const roleDefaults = ROLE_DEFAULTS[member.role as OrgRole] || {};
  const customPerms = (member.permissions as PermissionMap) || {};

  return { ...roleDefaults, ...customPerms };
}

export async function getMemberPermissions(orgId: string, userId: string) {
  const member = await prisma.organizationMember.findUnique({
    where: { userId_organizationId: { userId, organizationId: orgId } },
    include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
  });
  if (!member) throw new Error('Membre introuvable');

  const roleDefaults = ROLE_DEFAULTS[member.role as OrgRole] || {};
  const customPerms = (member.permissions as PermissionMap) || {};
  const effective = { ...roleDefaults, ...customPerms };

  return {
    user: member.user,
    role: member.role,
    roleDefaults,
    customOverrides: customPerms,
    effective,
  };
}

export async function grantPermission(orgId: string, userId: string, permission: Permission) {
  const member = await prisma.organizationMember.findUnique({
    where: { userId_organizationId: { userId, organizationId: orgId } },
  });
  if (!member) throw new Error('Membre introuvable');
  if (member.role === 'OWNER') throw new Error('Les permissions du propriétaire ne peuvent pas être modifiées');

  const currentPerms = (member.permissions as PermissionMap) || {};
  currentPerms[permission] = true;

  await prisma.organizationMember.update({
    where: { userId_organizationId: { userId, organizationId: orgId } },
    data: { permissions: currentPerms },
  });

  // Invalider le cache tenant
  cacheService.del(`${CACHE_PREFIX.TENANT}${userId}:${orgId}`);

  logger.info(`Permission ${permission} accordée à ${userId} dans org ${orgId}`);
}

export async function revokePermission(orgId: string, userId: string, permission: Permission) {
  const member = await prisma.organizationMember.findUnique({
    where: { userId_organizationId: { userId, organizationId: orgId } },
  });
  if (!member) throw new Error('Membre introuvable');
  if (member.role === 'OWNER') throw new Error('Les permissions du propriétaire ne peuvent pas être modifiées');

  const currentPerms = (member.permissions as PermissionMap) || {};
  currentPerms[permission] = false;

  await prisma.organizationMember.update({
    where: { userId_organizationId: { userId, organizationId: orgId } },
    data: { permissions: currentPerms },
  });

  cacheService.del(`${CACHE_PREFIX.TENANT}${userId}:${orgId}`);

  logger.info(`Permission ${permission} révoquée pour ${userId} dans org ${orgId}`);
}

export async function resetToDefaults(orgId: string, userId: string) {
  const member = await prisma.organizationMember.findUnique({
    where: { userId_organizationId: { userId, organizationId: orgId } },
  });
  if (!member) throw new Error('Membre introuvable');
  if (member.role === 'OWNER') throw new Error('Les permissions du propriétaire ne peuvent pas être modifiées');

  await prisma.organizationMember.update({
    where: { userId_organizationId: { userId, organizationId: orgId } },
    data: { permissions: {} },
  });

  cacheService.del(`${CACHE_PREFIX.TENANT}${userId}:${orgId}`);

  logger.info(`Permissions réinitialisées pour ${userId} dans org ${orgId}`);
}

export function listAvailable() {
  return getAllPermissions().map(p => ({
    key: p,
    label: getPermissionLabel(p),
  }));
}

function getPermissionLabel(permission: Permission): string {
  const labels: Record<Permission, string> = {
    [Permission.ORG_VIEW]: 'Voir l\'organisation',
    [Permission.ORG_EDIT]: 'Modifier l\'organisation',
    [Permission.ORG_DELETE]: 'Supprimer l\'organisation',
    [Permission.MEMBERS_VIEW]: 'Voir les membres',
    [Permission.MEMBERS_INVITE]: 'Inviter des membres',
    [Permission.MEMBERS_REMOVE]: 'Retirer des membres',
    [Permission.MEMBERS_ROLE_CHANGE]: 'Changer les rôles',
    [Permission.SUBSCRIPTION_VIEW]: 'Voir l\'abonnement',
    [Permission.SUBSCRIPTION_MANAGE]: 'Gérer l\'abonnement',
    [Permission.CONVERSATIONS_VIEW_ALL]: 'Voir toutes les conversations',
    [Permission.CONVERSATIONS_DELETE_ANY]: 'Supprimer les conversations',
    [Permission.ANALYTICS_VIEW]: 'Voir les analytics',
    [Permission.ANALYTICS_EXPORT]: 'Exporter les analytics',
    [Permission.AUDIT_VIEW]: 'Voir les logs d\'audit',
    [Permission.ALERTES_MANAGE]: 'Gérer les alertes fiscales',
    [Permission.PERMISSIONS_MANAGE]: 'Gérer les permissions',
  };
  return labels[permission] || permission;
}
