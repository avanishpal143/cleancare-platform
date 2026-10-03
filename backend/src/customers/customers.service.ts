import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { buildPaginationMeta } from '../common/dto/pagination.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findMe(userId: string) {
    const c = await this.prisma.customer.findUnique({
      where:   { userId },
      include: { addresses: { where: { isActive: true }, orderBy: { isDefault: 'desc' } } },
    });
    if (!c) throw new NotFoundException('Customer not found');
    return c;
  }

  async update(userId: string, dto: { name?: string; email?: string }) {
    const c = await this.prisma.customer.findUnique({ where: { userId } });
    if (!c) throw new NotFoundException('Customer not found');
    return this.prisma.customer.update({ where: { userId }, data: dto });
  }

  async findAll(params: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 20, search } = params;
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };
    if (search) {
      where.OR = [
        { name:   { contains: search, mode: 'insensitive' } },
        { mobile: { contains: search } },
        { email:  { contains: search, mode: 'insensitive' } },
      ];
    }
    const [items, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.customer.count({ where }),
    ]);
    return { items, total, meta: buildPaginationMeta(total, page, limit) };
  }

  // ---- Addresses ----
  async getAddresses(customerId: string) {
    return this.prisma.address.findMany({
      where:   { customerId, isActive: true },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });
  }

  async createAddress(customerId: string, dto: any) {
    if (dto.isDefault) {
      await this.prisma.address.updateMany({ where: { customerId }, data: { isDefault: false } });
    }
    return this.prisma.address.create({ data: { ...dto, customerId } });
  }

  async updateAddress(customerId: string, addressId: string, dto: any) {
    const addr = await this.prisma.address.findFirst({ where: { id: addressId, customerId } });
    if (!addr) throw new NotFoundException('Address not found');
    if (dto.isDefault) {
      await this.prisma.address.updateMany({ where: { customerId }, data: { isDefault: false } });
    }
    return this.prisma.address.update({ where: { id: addressId }, data: dto });
  }

  async deleteAddress(customerId: string, addressId: string) {
    const addr = await this.prisma.address.findFirst({ where: { id: addressId, customerId } });
    if (!addr) throw new NotFoundException('Address not found');
    return this.prisma.address.update({ where: { id: addressId }, data: { isActive: false } });
  }
}
