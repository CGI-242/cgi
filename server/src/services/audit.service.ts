import prisma from '../utils/prisma';
import { createLogger } from '../utils/logger';

const logger = createLogger('AuditService');

interface AuditLogInput {
  actorId: string;
  actorEmail: string;
  actorRole?: string;
  action: string;
  entityType: string;
  entityId: string;
  organizationId?: string;
  changes: unknown;
  metadata?: unknown;
}

export class AuditService {
  /**
   * Fire-and-forget : ne jamais await cet appel
   */
  static log(input: AuditLogInput): void {
    prisma.auditLog.create({
      data: {
        actorId: input.actorId,
        actorEmail: input.actorEmail,
        actorRole: input.actorRole,
        action: input.action as never,
        entityType: input.entityType,
        entityId: input.entityId,
        organizationId: input.organizationId,
        changes: input.changes as never,
        metadata: input.metadata as never,
      },
    }).catch(err => {
      logger.error('Erreur écriture audit log', err);
    });
  }

  static async getOrganizationAudit(orgId: string, options: { page?: number; limit?: number; action?: string } = {}) {
    const page = options.page || 1;
    const limit = options.limit || 50;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { organizationId: orgId };
    if (options.action) where.action = options.action;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { logs, total, page, limit, pages: Math.ceil(total / limit) };
  }

  static async getUserActions(userId: string, options: { page?: number; limit?: number } = {}) {
    const page = options.page || 1;
    const limit = options.limit || 50;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: { actorId: userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where: { actorId: userId } }),
    ]);

    return { logs, total, page, limit, pages: Math.ceil(total / limit) };
  }

  static async getEntityHistory(entityType: string, entityId: string) {
    return prisma.auditLog.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'asc' },
    });
  }

  static async search(orgId: string, query: { action?: string; actorId?: string; entityType?: string; from?: string; to?: string; page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { organizationId: orgId };
    if (query.action) where.action = query.action;
    if (query.actorId) where.actorId = query.actorId;
    if (query.entityType) where.entityType = query.entityType;
    if (query.from || query.to) {
      const createdAt: Record<string, Date> = {};
      if (query.from) createdAt.gte = new Date(query.from);
      if (query.to) createdAt.lte = new Date(query.to);
      where.createdAt = createdAt;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { logs, total, page, limit, pages: Math.ceil(total / limit) };
  }

  static async getStats(orgId: string, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const logs = await prisma.auditLog.findMany({
      where: { organizationId: orgId, createdAt: { gte: since } },
      select: { action: true, actorId: true, actorEmail: true, createdAt: true },
    });

    // Compter par action
    const byAction: Record<string, number> = {};
    const byActor: Record<string, { email: string; count: number }> = {};

    for (const log of logs) {
      byAction[log.action] = (byAction[log.action] || 0) + 1;
      if (!byActor[log.actorId]) {
        byActor[log.actorId] = { email: log.actorEmail, count: 0 };
      }
      byActor[log.actorId].count++;
    }

    return {
      total: logs.length,
      period: { days, since },
      byAction,
      topActors: Object.entries(byActor)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10)
        .map(([id, data]) => ({ userId: id, email: data.email, actions: data.count })),
    };
  }

  static async gdprCleanup(orgId: string, olderThanDays: number = 365) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - olderThanDays);

    const result = await prisma.auditLog.deleteMany({
      where: { organizationId: orgId, createdAt: { lt: cutoff } },
    });

    logger.info(`GDPR cleanup: ${result.count} audit logs supprimés pour org ${orgId} (avant ${cutoff.toISOString()})`);
    return { deleted: result.count, cutoffDate: cutoff };
  }
}
