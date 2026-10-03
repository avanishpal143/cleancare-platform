import {
  Injectable, NotFoundException, BadRequestException, Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma:  PrismaService,
    private config:  ConfigService,
    private audit:   AuditService,
    private notify:  NotificationsService,
  ) {}

  // ---- Initiate online payment (Razorpay) ----
  async initiatePayment(orderId: string, method: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.paymentStatus === 'PAID') throw new BadRequestException('Order already paid');

    const keyId     = this.config.get<string>('PAYMENT_KEY_ID');
    const keySecret = this.config.get<string>('PAYMENT_KEY_SECRET');

    if (!keyId || !keySecret) {
      this.logger.warn('Payment gateway keys not configured');
      // Dev fallback — return a mock gateway response
      return {
        gatewayOrderId: `order_dev_${Date.now()}`,
        key:            'rzp_test_dev',
        amount:         order.totalAmount,
      };
    }

    try {
      const Razorpay = require('razorpay');
      const rzp      = new Razorpay({ key_id: keyId, key_secret: keySecret });

      const gatewayOrder = await rzp.orders.create({
        amount:   Math.round(order.totalAmount * 100),
        currency: 'INR',
        receipt:  order.orderNumber,
        notes:    { orderId: order.id, orderNumber: order.orderNumber },
      });

      await this.prisma.payment.update({
        where: { orderId },
        data:  { gatewayOrderId: gatewayOrder.id, method: method as any },
      });

      return { gatewayOrderId: gatewayOrder.id, key: keyId, amount: order.totalAmount };
    } catch (err) {
      this.logger.error('Razorpay order creation failed:', err);
      throw new BadRequestException('Payment initiation failed. Please try again.');
    }
  }

  // ---- Verify payment (server-side) ----
  async verifyPayment(orderId: string, dto: {
    gatewayOrderId: string;
    gatewayPaymentId: string;
    gatewaySignature: string;
  }) {
    const keySecret = this.config.get<string>('PAYMENT_KEY_SECRET');

    // Verify Razorpay signature
    if (keySecret && keySecret !== 'replace_with_razorpay_key_secret') {
      const expectedSig = crypto
        .createHmac('sha256', keySecret)
        .update(`${dto.gatewayOrderId}|${dto.gatewayPaymentId}`)
        .digest('hex');

      if (expectedSig !== dto.gatewaySignature) {
        this.logger.warn(`Payment signature mismatch for order ${orderId}`);
        throw new BadRequestException('Payment verification failed — invalid signature');
      }
    }

    // Update payment record
    await this.prisma.payment.update({
      where: { orderId },
      data: {
        status:           'PAID',
        gatewayOrderId:   dto.gatewayOrderId,
        gatewayPaymentId: dto.gatewayPaymentId,
        gatewaySignature: dto.gatewaySignature,
        paidAt:           new Date(),
      },
    });

    await this.prisma.order.update({
      where: { id: orderId },
      data:  { paymentStatus: 'PAID' },
    });

    await this.audit.log({
      action:   'payment.verified',
      entity:   'Payment',
      entityId: orderId,
      newData:  { gatewayPaymentId: dto.gatewayPaymentId, status: 'PAID' },
    });

    await this.notify.triggerEvent('ORDER_BOOKED', orderId);

    return { success: true };
  }

  // ---- Webhook (Razorpay) ----
  async handleWebhook(payload: Buffer, signature: string): Promise<void> {
    const webhookSecret = this.config.get<string>('PAYMENT_WEBHOOK_SECRET');

    if (webhookSecret) {
      const expectedSig = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex');

      if (expectedSig !== signature) {
        throw new BadRequestException('Invalid webhook signature');
      }
    }

    const event = JSON.parse(payload.toString());
    this.logger.log(`Razorpay webhook: ${event.event}`);

    if (event.event === 'payment.captured') {
      const { order_id, id: paymentId } = event.payload.payment.entity;
      const payment = await this.prisma.payment.findFirst({ where: { gatewayOrderId: order_id } });
      if (payment && payment.status !== 'PAID') {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data:  { status: 'PAID', gatewayPaymentId: paymentId, paidAt: new Date() },
        });
        await this.prisma.order.update({
          where: { id: payment.orderId },
          data:  { paymentStatus: 'PAID' },
        });
      }
    }

    if (event.event === 'payment.failed') {
      const { order_id } = event.payload.payment.entity;
      const payment = await this.prisma.payment.findFirst({ where: { gatewayOrderId: order_id } });
      if (payment) {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data:  { status: 'FAILED', failReason: 'Payment failed via gateway' },
        });
        await this.prisma.order.update({
          where: { id: payment.orderId },
          data:  { paymentStatus: 'FAILED' },
        });
      }
    }
  }

  // ---- Refund ----
  async initiateRefund(orderId: string, amount: number, reason: string, actorId: string) {
    const payment = await this.prisma.payment.findUnique({ where: { orderId } });
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status !== 'PAID') throw new BadRequestException('Payment is not paid');

    await this.prisma.payment.update({
      where: { orderId },
      data:  { status: 'REFUNDED', refundAmount: amount, refundReason: reason, refundedAt: new Date() },
    });

    await this.audit.log({
      userId:   actorId,
      action:   'payment.refunded',
      entity:   'Payment',
      entityId: orderId,
      newData:  { amount, reason },
    });

    return { success: true };
  }

  async findAll(params: { page?: number; limit?: number; status?: string }) {
    const { page = 1, limit = 20, status } = params;
    const skip  = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.payment.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { createdAt: 'desc' },
        include: { order: { include: { customer: true } } },
      }),
      this.prisma.payment.count({ where }),
    ]);
    return { items, total };
  }
}
