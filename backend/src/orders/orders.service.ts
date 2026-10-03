import {
  Injectable, NotFoundException, BadRequestException,
  ForbiddenException, Logger,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { OrderStateMachine } from './order-state-machine';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import type { CreateOrderDTO, OrderStatus, UserRole, PaginationMeta } from '@cleancare/types';
import { buildPaginationMeta } from '../common/dto/pagination.dto';

// Date helpers
function startOfDay(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

// ---- Generate unique order number ----
function yyyymmdd() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
}
function generateOrderNumber(): string {
  const date = yyyymmdd();
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `ORD-${date}-${rand}`;
}

function generateInvoiceNumber(): string {
  const date = yyyymmdd();
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `INV-${date}-${rand}`;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private prisma:       PrismaService,
    private stateMachine: OrderStateMachine,
    private audit:        AuditService,
    private notify:       NotificationsService,
  ) {}

  // ---- Create order ----
  async create(customerId: string, dto: CreateOrderDTO) {
    // Validate service
    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
    });
    if (!service || !service.isActive) {
      throw new BadRequestException('Service not available');
    }

    // Validate addresses belong to customer
    const [pickupAddr, deliveryAddr] = await Promise.all([
      this.prisma.address.findFirst({ where: { id: dto.pickupAddressId, customerId } }),
      this.prisma.address.findFirst({ where: { id: dto.deliveryAddressId, customerId } }),
    ]);
    if (!pickupAddr)   throw new BadRequestException('Invalid pickup address');
    if (!deliveryAddr) throw new BadRequestException('Invalid delivery address');

    // Validate garments & build items
    const garmentIds = dto.items.map((i) => i.garmentId);
    const garments   = await this.prisma.garment.findMany({
      where: { id: { in: garmentIds }, serviceId: dto.serviceId, isActive: true },
    });

    if (garments.length !== garmentIds.length) {
      throw new BadRequestException('One or more garments are unavailable');
    }

    // Calculate pricing
    let subtotal = 0;
    const itemsData = dto.items.map((item) => {
      const garment = garments.find((g) => g.id === item.garmentId)!;
      const sub     = garment.unitPrice * item.quantity;
      subtotal += sub;
      return {
        garmentId:   item.garmentId,
        garmentName: garment.name,
        quantity:    item.quantity,
        unitPrice:   garment.unitPrice,
        subtotal:    sub,
        notes:       item.notes,
      };
    });

    const serviceCharge  = 50;
    const deliveryCharge = 0;
    const taxRate        = 0.18;
    const taxAmount      = Math.round(subtotal * taxRate);
    const totalAmount    = subtotal + serviceCharge + deliveryCharge + taxAmount;
    const garmentCount   = dto.items.reduce((s, i) => s + i.quantity, 0);

    // Validate coupon if provided
    let discountAmount = 0;
    if (dto.couponCode) {
      try {
        discountAmount = await this.validateAndApplyCoupon(dto.couponCode, customerId, subtotal);
      } catch {
        throw new BadRequestException('Invalid or expired coupon');
      }
    }

    // Check minimum order
    if (totalAmount - discountAmount < service.minOrderValue) {
      throw new BadRequestException(`Minimum order value is ₹${service.minOrderValue}`);
    }

    // Create order in transaction
    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber:        generateOrderNumber(),
          customerId,
          serviceId:          dto.serviceId,
          pickupAddressId:    dto.pickupAddressId,
          deliveryAddressId:  dto.deliveryAddressId,
          pickupDate:         new Date(dto.pickupDate),
          pickupSlotLabel:    dto.pickupSlotLabel,
          deliveryDate:       dto.deliveryDate ? new Date(dto.deliveryDate) : null,
          deliverySlotLabel:  dto.deliverySlotLabel,
          specialInstructions: dto.specialInstructions,
          garmentCount,
          subtotal,
          discountAmount,
          serviceCharge,
          deliveryCharge,
          taxAmount,
          totalAmount: totalAmount - discountAmount,
          paymentMethod: dto.paymentMethod,
          paymentStatus: dto.paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
          couponCode:    dto.couponCode,
          status:        'BOOKED',
          items: { create: itemsData },
        },
        include: { items: true, service: true },
      });

      // Status history
      await tx.orderStatusHistory.create({
        data: {
          orderId: newOrder.id,
          status:  'BOOKED',
          notes:   'Order placed by customer',
        },
      });

      // Create payment record
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          method:  dto.paymentMethod,
          amount:  newOrder.totalAmount,
          status:  'PENDING',
        },
      });

      // Create invoice
      await tx.invoice.create({
        data: {
          orderId:       newOrder.id,
          invoiceNumber: generateInvoiceNumber(),
          subtotal,
          discount:      discountAmount,
          serviceCharge,
          deliveryCharge,
          taxAmount,
          total:         newOrder.totalAmount,
        },
      });

      return newOrder;
    });

    // Audit log
    await this.audit.log({
      action:   'order.created',
      entity:   'Order',
      entityId: order.id,
      newData:  { status: 'BOOKED', total: order.totalAmount },
    });

    // Notification
    await this.notify.triggerEvent('ORDER_BOOKED', order.id);

    return order;
  }

  // ---- Get order by ID ----
  async findById(id: string, requesterId?: string, requesterRole?: UserRole) {
    const order = await this.prisma.order.findUnique({
      where:   { id },
      include: {
        items:         { include: { garment: true } },
        service:       true,
        pickupAddress:  true,
        deliveryAddress: true,
        customer:      true,
        statusHistory: { orderBy: { createdAt: 'asc' } },
        pickupJob:     { include: { driver: true } },
        deliveryJob:   { include: { driver: true } },
        payment:       true,
        invoice:       true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    // Customers can only see their own orders
    if (requesterRole === 'CUSTOMER' && order.customer.userId !== requesterId) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  // ---- Customer orders list ----
  async findByCustomer(customerId: string, params: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    search?: string;
  }) {
    const { page = 1, limit = 10, status, search } = params;
    const skip = (page - 1) * limit;

    const where: any = { customerId, deletedAt: null };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { createdAt: 'desc' },
        include: { service: true, pickupAddress: true, deliveryAddress: true },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      items,
      total,
      hasMore: skip + items.length < total,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  // ---- Admin orders list ----
  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: OrderStatus;
    serviceId?: string;
    paymentStatus?: string;
    driverId?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const { page = 1, limit = 20, search, status, serviceId, paymentStatus, driverId, dateFrom, dateTo } = params;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (status)        where.status = status;
    if (serviceId)     where.serviceId = serviceId;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo)   where.createdAt.lte = new Date(dateTo);
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customer:    { name:   { contains: search, mode: 'insensitive' } } },
        { customer:    { mobile: { contains: search } } },
      ];
    }
    if (driverId) {
      where.OR = [
        { pickupJob:  { driverId } },
        { deliveryJob:{ driverId } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true,
          service:  true,
          payment:  true,
          pickupJob:  { include: { driver: true } },
          deliveryJob:{ include: { driver: true } },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { items, total, meta: buildPaginationMeta(total, page, limit) };
  }

  // ---- Price estimate ----
  async estimatePrice(serviceId: string, items: { garmentId: string; quantity: number }[]) {
    const garments = await this.prisma.garment.findMany({
      where: { id: { in: items.map((i) => i.garmentId) }, serviceId, isActive: true },
    });

    let subtotal = 0;
    const lineItems = items.map((item) => {
      const garment = garments.find((g) => g.id === item.garmentId);
      if (!garment) throw new BadRequestException(`Garment not found: ${item.garmentId}`);
      const sub = garment.unitPrice * item.quantity;
      subtotal += sub;
      return { garmentId: item.garmentId, garmentName: garment.name, qty: item.quantity, unitPrice: garment.unitPrice, subtotal: sub };
    });

    const serviceCharge   = 50;
    const deliveryCharge  = 0;
    const taxRate         = 0.18;
    const taxAmount       = Math.round(subtotal * taxRate);
    const totalAmount     = subtotal + serviceCharge + deliveryCharge + taxAmount;

    return { items: lineItems, subtotal, discountAmount: 0, deliveryCharge, serviceCharge, taxAmount, taxRate: 18, totalAmount };
  }

  // ---- Update status ----
  async updateStatus(
    orderId: string,
    newStatus: OrderStatus,
    actorId: string,
    actorRole: UserRole,
    notes?: string,
  ) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    this.stateMachine.assertTransition(order.status, newStatus, actorRole);

    const updated = await this.prisma.$transaction(async (tx) => {
      const up = await tx.order.update({
        where: { id: orderId },
        data: {
          status: newStatus,
          completedAt: newStatus === 'COMPLETED' ? new Date() : undefined,
          cancelledAt: newStatus === 'CANCELLED' ? new Date() : undefined,
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status:       newStatus,
          changedBy:    actorId,
          changedByRole: actorRole,
          notes,
        },
      });

      return up;
    });

    // Audit
    await this.audit.log({
      userId:   actorId,
      action:   'order.status_changed',
      entity:   'Order',
      entityId: orderId,
      previousData: { status: order.status },
      newData:      { status: newStatus },
    });

    // Notification
    await this.notify.triggerEvent(`ORDER_${newStatus}`, orderId);

    return updated;
  }

  // ---- Assign pickup driver ----
  async assignPickupDriver(orderId: string, driverId: string, actorId: string, actorRole: UserRole) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    if (order.status !== 'BOOKED') {
      throw new BadRequestException('Can only assign driver to BOOKED orders');
    }

    const driver = await this.prisma.driver.findUnique({ where: { id: driverId } });
    if (!driver || !driver.isActive) throw new BadRequestException('Driver unavailable');

    await this.prisma.$transaction(async (tx) => {
      // Upsert pickup job
      await tx.pickupJob.upsert({
        where:  { orderId },
        create: { orderId, driverId, scheduledAt: order.pickupDate, status: 'ASSIGNED', expectedQty: order.garmentCount },
        update: { driverId, status: 'ASSIGNED' },
      });
    });

    return this.updateStatus(orderId, 'PICKUP_ASSIGNED', actorId, actorRole, `Assigned to driver ${driverId}`);
  }

  // ---- Assign delivery driver ----
  async assignDeliveryDriver(orderId: string, driverId: string, actorId: string, actorRole: UserRole) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    if (order.status !== 'READY_FOR_DELIVERY') {
      throw new BadRequestException('Order must be READY_FOR_DELIVERY');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.deliveryJob.upsert({
        where:  { orderId },
        create: { orderId, driverId, scheduledAt: order.deliveryDate ?? new Date(), status: 'ASSIGNED' },
        update: { driverId, status: 'ASSIGNED' },
      });
    });

    return this.updateStatus(orderId, 'OUT_FOR_DELIVERY', actorId, actorRole, `Delivery assigned to driver ${driverId}`);
  }

  // ---- Cancel order ----
  async cancel(orderId: string, reason: string, actorId: string, actorRole: UserRole) {
    return this.updateStatus(orderId, 'CANCELLED', actorId, actorRole, reason);
  }

  // ---- Coupon helper ----
  private async validateAndApplyCoupon(code: string, customerId: string, amount: number): Promise<number> {
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });
    if (!coupon || !coupon.isActive) throw new Error('Invalid coupon');
    if (new Date() < coupon.validFrom || new Date() > coupon.validUntil) throw new Error('Coupon expired');
    if (amount < coupon.minOrderValue) throw new Error('Minimum order not met');
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) throw new Error('Coupon limit reached');

    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = Math.round(amount * coupon.value / 100);
      if (coupon.maxDiscountAmt) discount = Math.min(discount, coupon.maxDiscountAmt);
    } else if (coupon.type === 'FLAT') {
      discount = coupon.value;
    }

    await this.prisma.coupon.update({
      where: { id: coupon.id },
      data:  { usageCount: { increment: 1 } },
    });

    return discount;
  }
}
