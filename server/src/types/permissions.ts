export enum Permission {
  // Organisation
  ORG_VIEW = 'org:view',
  ORG_EDIT = 'org:edit',
  ORG_DELETE = 'org:delete',

  // Membres
  MEMBERS_VIEW = 'members:view',
  MEMBERS_INVITE = 'members:invite',
  MEMBERS_REMOVE = 'members:remove',
  MEMBERS_ROLE_CHANGE = 'members:role_change',

  // Abonnement
  SUBSCRIPTION_VIEW = 'subscription:view',
  SUBSCRIPTION_MANAGE = 'subscription:manage',

  // Conversations
  CONVERSATIONS_VIEW_ALL = 'conversations:view_all',
  CONVERSATIONS_DELETE_ANY = 'conversations:delete_any',

  // Analytics
  ANALYTICS_VIEW = 'analytics:view',
  ANALYTICS_EXPORT = 'analytics:export',

  // Audit
  AUDIT_VIEW = 'audit:view',

  // Alertes
  ALERTES_MANAGE = 'alertes:manage',

  // Permissions
  PERMISSIONS_MANAGE = 'permissions:manage',
}

export type PermissionMap = Record<string, boolean>;

export type OrgRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

// Hiérarchie des rôles (index plus élevé = plus de pouvoir)
const ROLE_HIERARCHY: OrgRole[] = ['VIEWER', 'MEMBER', 'ADMIN', 'OWNER'];

export function getRoleLevel(role: OrgRole): number {
  return ROLE_HIERARCHY.indexOf(role);
}

export function isRoleAtLeast(current: OrgRole, minimum: OrgRole): boolean {
  return getRoleLevel(current) >= getRoleLevel(minimum);
}

// Permissions par défaut pour chaque rôle
export const ROLE_DEFAULTS: Record<OrgRole, PermissionMap> = {
  VIEWER: {
    [Permission.ORG_VIEW]: true,
    [Permission.MEMBERS_VIEW]: true,
    [Permission.SUBSCRIPTION_VIEW]: true,
  },
  MEMBER: {
    [Permission.ORG_VIEW]: true,
    [Permission.MEMBERS_VIEW]: true,
    [Permission.SUBSCRIPTION_VIEW]: true,
    [Permission.CONVERSATIONS_VIEW_ALL]: true,
    [Permission.ANALYTICS_VIEW]: true,
  },
  ADMIN: {
    [Permission.ORG_VIEW]: true,
    [Permission.ORG_EDIT]: true,
    [Permission.MEMBERS_VIEW]: true,
    [Permission.MEMBERS_INVITE]: true,
    [Permission.MEMBERS_REMOVE]: true,
    [Permission.MEMBERS_ROLE_CHANGE]: true,
    [Permission.SUBSCRIPTION_VIEW]: true,
    [Permission.SUBSCRIPTION_MANAGE]: true,
    [Permission.CONVERSATIONS_VIEW_ALL]: true,
    [Permission.CONVERSATIONS_DELETE_ANY]: true,
    [Permission.ANALYTICS_VIEW]: true,
    [Permission.ANALYTICS_EXPORT]: true,
    [Permission.AUDIT_VIEW]: true,
    [Permission.ALERTES_MANAGE]: true,
  },
  OWNER: {
    [Permission.ORG_VIEW]: true,
    [Permission.ORG_EDIT]: true,
    [Permission.ORG_DELETE]: true,
    [Permission.MEMBERS_VIEW]: true,
    [Permission.MEMBERS_INVITE]: true,
    [Permission.MEMBERS_REMOVE]: true,
    [Permission.MEMBERS_ROLE_CHANGE]: true,
    [Permission.SUBSCRIPTION_VIEW]: true,
    [Permission.SUBSCRIPTION_MANAGE]: true,
    [Permission.CONVERSATIONS_VIEW_ALL]: true,
    [Permission.CONVERSATIONS_DELETE_ANY]: true,
    [Permission.ANALYTICS_VIEW]: true,
    [Permission.ANALYTICS_EXPORT]: true,
    [Permission.AUDIT_VIEW]: true,
    [Permission.ALERTES_MANAGE]: true,
    [Permission.PERMISSIONS_MANAGE]: true,
  },
};

export function getAllPermissions(): Permission[] {
  return Object.values(Permission);
}
