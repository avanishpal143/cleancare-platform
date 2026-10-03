import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

const PROCESSING_STAGES = ['RECEIVED','SORTING','PROCESSING','QC','PACKING','READY'];

@Injectable()
export class ProcessingService {
  constructor(private prisma: PrismaService) {}

  async receiveOrder(orderId: string, dto: { receivedQty: number; receivedBy: string; centerId: string; notes?: string }) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'PICKED_UP') throw new BadRequestException('Order must be in PICKED_UP state');

    const qtyMismatch = dto.receivedQty !== order.garmentCount;

    const record = await this.prisma.processingRecord.upsert({
      where:  { orderId },
      create: {
        orderId, processingCenterId: dto.centerId, receivedBy: dto.receivedBy,
        receivedAt: new Date(), expectedQty: order.garmentCount,
        receivedQty: dto.receivedQty, qtyMismatch, currentStage: 'RECEIVED', notes: dto.notes,
      },
      update: { receivedQty: dto.receivedQty, receivedAt: new Date(), qtyMismatch, currentStage: 'RECEIVED' },
    });

    if (qtyMismatch) {
      await this.prisma.exception.create({
        data: {
          orderId, type: 'QUANTITY_MISMATCH', severity: 'MEDIUM',
          description: `Expected ${order.garmentCount}, received ${dto.receivedQty} at center`,
          status: 'OPEN', createdBy: dto.receivedBy,
        },
      });
    }

    // Update order status → RECEIVED
    await this.prisma.order.update({ where: { id: orderId }, data: { status: 'RECEIVED', processingCenterId: dto.centerId } });
    await this.prisma.orderStatusHistory.create({
      data: { orderId, status: 'RECEIVED', changedBy: dto.receivedBy, changedByRole: 'PROCESSING_MANAGER' },
    });

    return record;
  }

  async advanceStage(orderId: string, stage: string, actorId: string) {
    const record = await this.prisma.processingRecord.findUnique({ where: { orderId } });
    if (!record) throw new NotFoundException('Processing record not found');

    return this.prisma.processingRecord.update({
      where: { orderId },
      data:  { currentStage: stage },
    });
  }

  async findAll(params: any) {
    const { page = 1, limit = 20 } = params;
    return this.prisma.processingRecord.findMany({
      skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' },
      include: { order: { include: { customer: true, service: true } } },
    });
  }
}
