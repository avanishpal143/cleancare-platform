import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

interface AuditParams {
  userId?: string;
  userRole?: string;
  action: string;
  entity: string;
  entityId: string;
  previousData?: unknown;
  newData?: unknown;
  ipAddress?: string;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(params: AuditParams) {
    try {
      await this.prisma.auditLog.create({ data: params as any });
    } catch {
      // Never throw — audit failures should not break business operations
    }
  }

  async findAll(params: { page?: number; limit?: number; entity?: string; userId?: string }) {
    const { page = 1, limit = 50, entity, userId } = params;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (entity) where.entity = entity;
    if (userId) where.userId = userId;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.auditLog.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { items, total };
  }
}
