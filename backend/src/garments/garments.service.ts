import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class GarmentsService {
  constructor(private prisma: PrismaService) {}

  async findByService(serviceId: string, onlyActive = true) {
    return this.prisma.garment.findMany({
      where:   { serviceId, deletedAt: null, ...(onlyActive ? { isActive: true } : {}) },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async findAll(onlyActive = false) {
    return this.prisma.garment.findMany({
      where:   { deletedAt: null, ...(onlyActive ? { isActive: true } : {}) },
      include: { service: { select: { id: true, name: true } } },
      orderBy: [{ service: { name: 'asc' } }, { sortOrder: 'asc' }],
    });
  }

  async findOne(id: string) {
    const g = await this.prisma.garment.findFirst({ where: { id, deletedAt: null } });
    if (!g) throw new NotFoundException('Garment not found');
    return g;
  }

  async create(dto: any) {
    const slug = dto.name.toLowerCase().replace(/\s+/g, '-');
    return this.prisma.garment.create({ data: { ...dto, slug } });
  }

  async update(id: string, dto: any) {
    await this.findOne(id);
    return this.prisma.garment.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.garment.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
