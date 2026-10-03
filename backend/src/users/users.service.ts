import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { buildPaginationMeta } from '../common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { page?: number; limit?: number; search?: string; role?: string }) {
    const { page = 1, limit = 20, search, role } = params;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (role) where.role = role;
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { mobile: { contains: search } }];
    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, select: { id: true, mobile: true, name: true, email: true, role: true, isActive: true, createdAt: true } }),
      this.prisma.user.count({ where }),
    ]);
    return { items, total, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOne(id: string) {
    const u = await this.prisma.user.findUnique({ where: { id } });
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  async create(dto: any) {
    return this.prisma.user.create({ data: dto });
  }

  async update(id: string, dto: any) {
    await this.findOne(id);
    return this.prisma.user.update({ where: { id }, data: dto });
  }

  async toggleActive(id: string, isActive: boolean) {
    return this.prisma.user.update({ where: { id }, data: { isActive } });
  }
}
