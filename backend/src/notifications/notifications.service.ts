import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';

// Event → notification body map
const EVENT_TEMPLATES: Record<string, { subject: string; body: string }> = {
  ORDER_BOOKED:             { subject: 'Order Confirmed', body: 'Your order {{orderNumber}} has been confirmed. We will pick it up soon!' },
  ORDER_PICKUP_ASSIGNED:    { subject: 'Pickup Scheduled', body: 'Your pickup for order {{orderNumber}} has been scheduled.' },
  ORDER_PICKED_UP:          { subject: 'Order Picked Up', body: 'Your clothes have been picked up. We will start cleaning soon!' },
  ORDER_RECEIVED:           { subject: 'Received at Center', body: 'Your order {{orderNumber}} has been received at our cleaning center.' },
  ORDER_PROCESSING:         { subject: 'Cleaning Started', body: 'Your clothes are being cleaned. We will notify you when done.' },
  ORDER_QC:                 { subject: 'Quality Check', body: 'Your order is undergoing quality inspection.' },
  ORDER_PACKED:             { subject: 'Order Packed', body: 'Your clothes are packed and ready for delivery!' },
  ORDER_READY_FOR_DELIVERY: { subject: 'Ready for Delivery', body: 'Great news! Your order {{orderNumber}} is ready for delivery.' },
  ORDER_OUT_FOR_DELIVERY:   { subject: 'Out for Delivery', body: 'Your clothes are on the way! Expected delivery soon.' },
  ORDER_DELIVERED:          { subject: 'Delivered', body: 'Your order {{orderNumber}} has been delivered. Thank you for choosing CleanCare!' },
  ORDER_COMPLETED:          { subject: 'Order Completed', body: 'Your order is complete. We hope you enjoy your fresh clothes!' },
  ORDER_CANCELLED:          { subject: 'Order Cancelled', body: 'Your order {{orderNumber}} has been cancelled.' },
};

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma:  PrismaService,
    private config:  ConfigService,
  ) {}

  async triggerEvent(event: string, orderId: string): Promise<void> {
    try {
      const order = await this.prisma.order.findUnique({
        where:   { id: orderId },
        include: { customer: true },
      });
      if (!order) return;

      const template = EVENT_TEMPLATES[event];
      if (!template) return;

      const body = template.body.replace('{{orderNumber}}', order.orderNumber);

      // Store notification
      const user = await this.prisma.user.findUnique({
        where: { id: order.customer.userId },
      });
      if (!user) return;

      await this.prisma.notification.create({
        data: {
          userId:  user.id,
          orderId: order.id,
          channel: 'IN_APP',
          subject: template.subject,
          body,
          status:  'SENT',
          sentAt:  new Date(),
        },
      });

      // Push notification (if FCM token available)
      if (user.fcmToken) {
        await this.sendPush(user.fcmToken, template.subject, body);
      }

      // SMS
      await this.sendSms(order.customer.mobile, body);

      this.logger.log(`Notification sent: ${event} for order ${order.orderNumber}`);
    } catch (err) {
      this.logger.error(`Failed to send notification for event ${event}:`, err);
    }
  }

  private async sendPush(fcmToken: string, title: string, body: string): Promise<void> {
    const projectId    = this.config.get<string>('FIREBASE_PROJECT_ID');
    const privateKey   = this.config.get<string>('FIREBASE_PRIVATE_KEY');
    const clientEmail  = this.config.get<string>('FIREBASE_CLIENT_EMAIL');

    if (!projectId || !privateKey || !clientEmail) return;

    try {
      // Firebase Admin SDK integration point
      // In production: initialize firebase-admin and call messaging().send()
      this.logger.debug(`[PUSH] To: ${fcmToken.slice(0, 20)}… | ${title}`);
    } catch (err) {
      this.logger.warn('Push notification failed:', err);
    }
  }

  private async sendSms(mobile: string, message: string): Promise<void> {
    const apiKey   = this.config.get<string>('SMS_PROVIDER_KEY');
    const devMode  = this.config.get<string>('OTP_DEV_MODE') === 'true';
    if (!apiKey || devMode) {
      this.logger.debug(`[DEV SMS] +91${mobile}: ${message}`);
      return;
    }
    // SMS provider integration point
  }

  async findForUser(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where:   { userId },
        skip,
        take:    limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where: { userId } }),
    ]);
    return { items, total };
  }
}
