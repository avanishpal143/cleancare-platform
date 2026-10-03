import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class OffersService {
  constructor(private prisma: PrismaService) {}

  async findActive() {
    return this.prisma.coupon.findMany({
      where: { isActive: true, validFrom: { lte: new Date() }, validUntil: { gte: new Date() } },
    });
  }

  async findAll() {
    return this.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async validate(code: string, serviceId?: string, amount?: number) {
    const c = await this.prisma.coupon.findUnique({ where: { code } });
    if (!c || !c.isActive) throw new BadRequestException('Invalid coupon');
    if (new Date() < c.validFrom || new Date() > c.validUntil) throw new BadRequestException('Coupon expired');
    if (amount && amount < c.minOrderValue) throw new BadRequestException(`Min order ₹${c.minOrderValue}`);
    if (c.serviceId && c.serviceId !== serviceId) throw new BadRequestException('Coupon not valid for this service');
    if (c.usageLimit && c.usageCount >= c.usageLimit) throw new BadRequestException('Coupon limit reached');
    return { valid: true, coupon: c };
  }

  async create(dto: any) { return this.prisma.coupon.create({ data: dto }); }
  async update(id: string, dto: any) { return this.prisma.coupon.update({ where: { id }, data: dto }); }
  async delete(id: string) { return this.prisma.coupon.update({ where: { id }, data: { isActive: false } }); }
}
