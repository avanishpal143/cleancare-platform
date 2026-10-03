import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(onlyActive = false) {
    return this.prisma.service.findMany({
      where:   { deletedAt: null, ...(onlyActive ? { isActive: true } : {}) },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      include: { _count: { select: { garments: true } } },
    });
  }

  async findOne(id: string) {
    const s = await this.prisma.service.findFirst({ where: { id, deletedAt: null } });
    if (!s) throw new NotFoundException('Service not found');
    return s;
  }

  async create(dto: any) {
    const slug = dto.name.toLowerCase().replace(/\s+/g, '-');
    const existing = await this.prisma.service.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Service with this name already exists');
    return this.prisma.service.create({ data: { ...dto, slug } });
  }

  async update(id: string, dto: any) {
    await this.findOne(id);
    return this.prisma.service.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.service.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async toggleActive(id: string, isActive: boolean) {
    await this.findOne(id);
    return this.prisma.service.update({ where: { id }, data: { isActive } });
  }
}
