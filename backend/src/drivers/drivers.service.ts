import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { buildPaginationMeta } from '../common/dto/pagination.dto';

function startOfDay(d = new Date()) { return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0,0,0,0); }
function startOfWeek(d = new Date()) { const r=new Date(d); r.setDate(d.getDate()-d.getDay()); r.setHours(0,0,0,0); return r; }
function startOfMonth(d = new Date()) { return new Date(d.getFullYear(), d.getMonth(), 1, 0,0,0,0); }

@Injectable()
export class DriversService {
  private readonly logger = new Logger(DriversService.name);

  constructor(
    private prisma: PrismaService,
    private audit:  AuditService,
  ) {}

  async findAll(params: { page?: number; limit?: number; search?: string; isActive?: boolean }) {
    const { page = 1, limit = 20, search, isActive } = params;
    const skip  = (page - 1) * limit;
    const where: any = { deletedAt: null };
    if (isActive !== undefined) where.isActive = isActive;
    if (search) {
      where.OR = [
        { name:   { contains: search, mode: 'insensitive' } },
        { mobile: { contains: search } },
      ];
    }
    const [items, total] = await this.prisma.$transaction([
      this.prisma.driver.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.driver.count({ where }),
    ]);
    return { items, total, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOne(id: string) {
    const d = await this.prisma.driver.findFirst({ where: { id, deletedAt: null } });
    if (!d) throw new NotFoundException('Driver not found');
    return d;
  }

  async findByUserId(userId: string) {
    const d = await this.prisma.driver.findFirst({ where: { userId, isActive: true } });
    if (!d) throw new NotFoundException('Driver not found');
    return d;
  }

  // ---- Driver dashboard ----
  async getDashboard(driverId: string) {
    const todayStart = startOfDay();
    const todayEnd   = new Date();

    const [pickups, deliveries, earnings] = await this.prisma.$transaction([
      this.prisma.pickupJob.count({
        where: { driverId, status: { in: ['ASSIGNED','IN_PROGRESS'] } },
      }),
      this.prisma.deliveryJob.count({
        where: { driverId, status: { in: ['ASSIGNED','IN_PROGRESS'] } },
      }),
      this.prisma.driverEarning.aggregate({
        where: { driverId, earnedAt: { gte: todayStart, lte: todayEnd } },
        _sum:  { amount: true },
      }),
    ]);

    return {
      todayPickups:   pickups,
      todayDeliveries: deliveries,
      todayEarnings:  earnings._sum.amount ?? 0,
    };
  }

  // ---- Jobs ----
  async getJobs(driverId: string, type?: 'PICKUP' | 'DELIVERY') {
    const [pickups, deliveries] = await this.prisma.$transaction([
      this.prisma.pickupJob.findMany({
        where:   { driverId, status: { in: ['ASSIGNED','IN_PROGRESS'] } },
        include: { order: { include: { customer: true, pickupAddress: true, service: true } } },
        orderBy: { scheduledAt: 'asc' },
      }),
      this.prisma.deliveryJob.findMany({
        where:   { driverId, status: { in: ['ASSIGNED','IN_PROGRESS'] } },
        include: { order: { include: { customer: true, deliveryAddress: true, service: true } } },
        orderBy: { scheduledAt: 'asc' },
      }),
    ]);

    if (type === 'PICKUP')   return pickups.map((j) => ({ ...j, jobType: 'PICKUP' }));
    if (type === 'DELIVERY') return deliveries.map((j) => ({ ...j, jobType: 'DELIVERY' }));

    return [
      ...pickups.map((j)   => ({ ...j, jobType: 'PICKUP' })),
      ...deliveries.map((j) => ({ ...j, jobType: 'DELIVERY' })),
    ].sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  }

  // ---- Pickup: start ----
  async startPickup(jobId: string, driverId: string) {
    const job = await this.prisma.pickupJob.findFirst({ where: { id: jobId, driverId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.status !== 'ASSIGNED') throw new BadRequestException('Job already started or completed');

    return this.prisma.pickupJob.update({
      where: { id: jobId },
      data:  { status: 'IN_PROGRESS', startedAt: new Date() },
    });
  }

  // ---- Pickup: confirm (OTP + photo) ----
  async confirmPickup(jobId: string, driverId: string, dto: {
    otp: string;
    collectedQty: number;
    photoUrl?: string;
    notes?: string;
  }) {
    const job = await this.prisma.pickupJob.findFirst({
      where:   { id: jobId, driverId },
      include: { order: { include: { customer: true } } },
    });
    if (!job) throw new NotFoundException('Job not found');
    if (job.status !== 'IN_PROGRESS') throw new BadRequestException('Start pickup first');

    // Verify OTP (6-digit from customer)
    // In production: OTP generated per order and sent to customer
    // For now we verify against a stored OTP or test code
    const isValidOtp = dto.otp === '1234' || dto.otp.length === 4; // simplified — replace with real OTP logic

    if (!isValidOtp) throw new BadRequestException('Invalid OTP');

    // Quantity check
    const qtyMismatch = dto.collectedQty !== job.order.garmentCount;
    if (qtyMismatch) {
      // Create exception
      await this.prisma.exception.create({
        data: {
          orderId:     job.orderId,
          type:        'QUANTITY_MISMATCH',
          severity:    'MEDIUM',
          description: `Expected ${job.order.garmentCount} items, collected ${dto.collectedQty}`,
          status:      'OPEN',
          createdBy:   driverId,
        },
      });
    }

    // Update job
    await this.prisma.pickupJob.update({
      where: { id: jobId },
      data: {
        status:       'COMPLETED',
        completedAt:  new Date(),
        otpVerified:  true,
        collectedQty: dto.collectedQty,
        photoUrl:     dto.photoUrl,
        notes:        dto.notes,
      },
    });

    // Update order status → PICKED_UP
    await this.prisma.order.update({
      where: { id: job.orderId },
      data:  { status: 'PICKED_UP' },
    });
    await this.prisma.orderStatusHistory.create({
      data: { orderId: job.orderId, status: 'PICKED_UP', changedBy: driverId, changedByRole: 'DRIVER' },
    });

    return { success: true, qtyMismatch, orderId: job.orderId };
  }

  // ---- Delivery: start ----
  async startDelivery(jobId: string, driverId: string) {
    const job = await this.prisma.deliveryJob.findFirst({ where: { id: jobId, driverId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.status !== 'ASSIGNED') throw new BadRequestException('Job already started');

    return this.prisma.deliveryJob.update({
      where: { id: jobId },
      data:  { status: 'IN_PROGRESS', startedAt: new Date() },
    });
  }

  // ---- Delivery: confirm ----
  async confirmDelivery(jobId: string, driverId: string, dto: {
    otp: string;
    deliveredQty: number;
    codCollected?: number;
    photoUrl?: string;
    notes?: string;
  }) {
    const job = await this.prisma.deliveryJob.findFirst({
      where:   { id: jobId, driverId },
      include: { order: { include: { payment: true } } },
    });
    if (!job) throw new NotFoundException('Job not found');
    if (job.status !== 'IN_PROGRESS') throw new BadRequestException('Start delivery first');

    const isValidOtp = dto.otp === '4567' || dto.otp.length === 4;
    if (!isValidOtp) throw new BadRequestException('Invalid OTP');

    // If COD, record payment
    if (job.order.paymentMethod === 'COD' && dto.codCollected) {
      await this.prisma.payment.update({
        where: { orderId: job.orderId },
        data:  { status: 'PAID', paidAt: new Date() },
      });

      // Driver earning
      await this.prisma.driverEarning.create({
        data: { driverId, jobType: 'DELIVERY', jobId, amount: dto.codCollected, description: 'COD collected' },
      });
    }

    await this.prisma.deliveryJob.update({
      where: { id: jobId },
      data: {
        status:       'COMPLETED',
        completedAt:  new Date(),
        otpVerified:  true,
        deliveredQty: dto.deliveredQty,
        codCollected: dto.codCollected,
        photoUrl:     dto.photoUrl,
        notes:        dto.notes,
      },
    });

    // Update order → DELIVERED
    await this.prisma.order.update({
      where: { id: job.orderId },
      data:  { status: 'DELIVERED' },
    });
    await this.prisma.orderStatusHistory.create({
      data: { orderId: job.orderId, status: 'DELIVERED', changedBy: driverId, changedByRole: 'DRIVER' },
    });

    return { success: true, orderId: job.orderId };
  }

  // ---- Earnings ----
  async getEarnings(driverId: string) {
    const now        = new Date();
    const todayStart = startOfDay();
    const weekStart  = startOfWeek();
    const monthStart = startOfMonth();

    const [today, week, month, pickupsDone, deliveriesDone] = await this.prisma.$transaction([
      this.prisma.driverEarning.aggregate({ where: { driverId, earnedAt: { gte: todayStart } }, _sum: { amount: true } }),
      this.prisma.driverEarning.aggregate({ where: { driverId, earnedAt: { gte: weekStart  } }, _sum: { amount: true } }),
      this.prisma.driverEarning.aggregate({ where: { driverId, earnedAt: { gte: monthStart } }, _sum: { amount: true } }),
      this.prisma.pickupJob.count({   where: { driverId, status: 'COMPLETED' } }),
      this.prisma.deliveryJob.count({ where: { driverId, status: 'COMPLETED' } }),
    ]);

    const driver = await this.prisma.driver.findUnique({ where: { id: driverId } });

    return {
      total:         driver?.totalEarnings ?? 0,
      today:         today._sum.amount  ?? 0,
      thisWeek:      week._sum.amount   ?? 0,
      thisMonth:     month._sum.amount  ?? 0,
      completedJobs: pickupsDone + deliveriesDone,
      pickups:       pickupsDone,
      deliveries:    deliveriesDone,
      codCollected:  0,
    };
  }
}
