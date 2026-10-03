import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class QcService {
  constructor(private prisma: PrismaService) {}

  async recordQC(orderId: string, dto: { garmentId?: string; garmentName?: string; result: string; notes?: string; imageUrl?: string; checkedBy: string }) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'QC') throw new BadRequestException('Order must be in QC status');

    const requiresReprocess = dto.result === 'FAIL' || dto.result === 'REPROCESS';

    const record = await this.prisma.qCRecord.create({
      data: { orderId, garmentId: dto.garmentId, garmentName: dto.garmentName, result: dto.result as any, notes: dto.notes, imageUrl: dto.imageUrl, checkedBy: dto.checkedBy, requiresReprocess },
    });

    if (requiresReprocess) {
      await this.prisma.exception.create({
        data: { orderId, garmentId: dto.garmentId, type: 'FAILED_QC', severity: 'MEDIUM', description: `QC ${dto.result}: ${dto.notes ?? 'No notes'}`, status: 'OPEN', createdBy: dto.checkedBy },
      });
      // Reprocess: back to PROCESSING
      await this.prisma.order.update({ where: { id: orderId }, data: { status: 'PROCESSING' } });
      await this.prisma.orderStatusHistory.create({ data: { orderId, status: 'PROCESSING', changedBy: dto.checkedBy, notes: 'QC failed — reprocessing' } });
    } else {
      // Pass: advance to PACKED
      await this.prisma.order.update({ where: { id: orderId }, data: { status: 'PACKED' } });
      await this.prisma.orderStatusHistory.create({ data: { orderId, status: 'PACKED', changedBy: dto.checkedBy, notes: 'QC passed' } });
    }

    return record;
  }

  async findForOrder(orderId: string) {
    return this.prisma.qCRecord.findMany({ where: { orderId }, orderBy: { checkedAt: 'desc' } });
  }
}
