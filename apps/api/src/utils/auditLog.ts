import { prisma } from '../config/prisma';
import { Request } from 'express';

export async function auditLog(params: {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  before?: unknown;
  after?: unknown;
  metadata?: unknown;
  req?: Request;
}) {
  await prisma.auditLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      before: params.before as any,
      after: params.after as any,
      metadata: params.metadata as any,
      ipAddress: params.req?.ip,
      userAgent: params.req?.headers['user-agent'],
    },
  });
}
