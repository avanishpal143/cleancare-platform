import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

// Pure Date helpers — no external dependency
function startOfDay(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}
function endOfDay(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}
function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}
function subtractDays(d: Date, n: number) {
  const r = new Date(d); r.setDate(r.getDate() - n); return r;
}
function subtractMonths(d: Date, n: number) {
  const r = new Date(d); r.setMonth(r.getMonth() - n); return r;
}
function formatDate(d: Date) {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardKPIs() {
    const now          = new Date();
    const todayStart   = startOfDay(now);
    const monthStart   = startOfMonth(now);
    const lastMStart   = startOfMonth(subtractMonths(now, 1));
    const lastMEnd     = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const [
      totalOrders, todayOrders, inProcessing, readyForDelivery,
      revenueMTD, complaints, exceptions,
      lastMonthOrders, lastMonthRevenue,
    ] = await this.prisma.$transaction([
      this.prisma.order.count({ where: { deletedAt: null } }),
      this.prisma.order.count({ where: { createdAt: { gte: todayStart }, deletedAt: null } }),
      this.prisma.order.count({ where: { status: { in: ['PROCESSING','QC','PACKED'] as any }, deletedAt: null } }),
      this.prisma.order.count({ where: { status: 'READY_FOR_DELIVERY' as any, deletedAt: null } }),
      this.prisma.payment.aggregate({ where: { status: 'PAID', createdAt: { gte: monthStart } }, _sum: { amount: true } }),
      this.prisma.supportTicket.count({ where: { status: { not: 'CLOSED' as any } } }),
      this.prisma.exception.count({ where: { status: { not: 'CLOSED' as any } } }),
      this.prisma.order.count({ where: { createdAt: { gte: lastMStart, lte: lastMEnd } } }),
      this.prisma.payment.aggregate({ where: { status: 'PAID', createdAt: { gte: lastMStart, lte: lastMEnd } }, _sum: { amount: true } }),
    ]);

    const revenue       = revenueMTD._sum.amount ?? 0;
    const lastRev       = lastMonthRevenue._sum.amount ?? 0;
    const ordersGrowth  = lastMonthOrders > 0
      ? Math.round(((totalOrders - lastMonthOrders) / lastMonthOrders) * 100) : 0;
    const revenueGrowth = lastRev > 0
      ? Math.round(((revenue - lastRev) / lastRev) * 100) : 0;

    return {
      totalOrders, todayOrders, inProcessing, readyForDelivery,
      revenue, complaints, exceptions, ordersGrowth, revenueGrowth,
    };
  }

  async getOrdersChart(days = 7) {
    const rows: { date: string; orders: number; revenue: number }[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const day   = subtractDays(now, i);
      const start = startOfDay(day);
      const end   = endOfDay(day);

      const [count, rev] = await this.prisma.$transaction([
        this.prisma.order.count({ where: { createdAt: { gte: start, lte: end }, deletedAt: null } }),
        this.prisma.payment.aggregate({
          where: { status: 'PAID', createdAt: { gte: start, lte: end } },
          _sum:  { amount: true },
        }),
      ]);

      rows.push({ date: formatDate(day), orders: count, revenue: rev._sum.amount ?? 0 });
    }
    return rows;
  }

  async getOrdersByService() {
    const result = await this.prisma.order.groupBy({
      by:     ['serviceId'],
      where:  { deletedAt: null },
      _count: { id: true },
      _sum:   { totalAmount: true },
    });

    const serviceIds = result.map((r) => r.serviceId);
    const services   = await this.prisma.service.findMany({ where: { id: { in: serviceIds } } });
    const map        = Object.fromEntries(services.map((s) => [s.id, s.name]));

    return result.map((r) => ({
      service: map[r.serviceId] ?? r.serviceId,
      count:   r._count.id,
      revenue: r._sum.totalAmount ?? 0,
    }));
  }

  async getOrderStatusDistribution() {
    const result = await this.prisma.order.groupBy({
      by:     ['status'],
      where:  { deletedAt: null },
      _count: { id: true },
    });
    const total = result.reduce((s, r) => s + r._count.id, 0);
    return result.map((r) => ({
      status:     r.status,
      count:      r._count.id,
      percentage: total > 0 ? Math.round((r._count.id / total) * 100) : 0,
    }));
  }

  async getRecentOrders(limit = 5) {
    return this.prisma.order.findMany({
      where:   { deletedAt: null },
      take:    limit,
      orderBy: { createdAt: 'desc' },
      include: { customer: true, service: true, payment: true },
    });
  }

  async getDriverPerformance(params: { dateFrom?: string; dateTo?: string }) {
    const drivers = await this.prisma.driver.findMany({
      where:   { isActive: true },
      include: {
        pickupJobs:   { where: { status: 'COMPLETED' }, select: { id: true } },
        deliveryJobs: { where: { status: 'COMPLETED' }, select: { id: true, codCollected: true } },
      },
    });

    return drivers.map((d) => ({
      id:           d.id,
      name:         d.name,
      mobile:       d.mobile,
      pickups:      d.pickupJobs.length,
      deliveries:   d.deliveryJobs.length,
      totalJobs:    d.pickupJobs.length + d.deliveryJobs.length,
      codCollected: d.deliveryJobs.reduce((s, j) => s + (j.codCollected ?? 0), 0),
      rating:       d.rating,
    }));
  }
}
