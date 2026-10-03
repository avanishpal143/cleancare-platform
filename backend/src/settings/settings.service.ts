import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(category?: string) {
    return this.prisma.setting.findMany({ where: category ? { category } : undefined, orderBy: { key: 'asc' } });
  }

  async findPublic() {
    return this.prisma.setting.findMany({ where: { isPublic: true } });
  }

  async get(key: string) {
    return this.prisma.setting.findUnique({ where: { key } });
  }

  async set(key: string, value: string, category = 'general', isPublic = false, updatedBy?: string) {
    return this.prisma.setting.upsert({
      where:  { key },
      create: { key, value, category, isPublic, updatedBy },
      update: { value, updatedBy },
    });
  }

  async setBulk(settings: { key: string; value: string }[], updatedBy?: string) {
    return Promise.all(settings.map((s) => this.set(s.key, s.value, undefined, undefined, updatedBy)));
  }

  async findSlots(type: 'pickup' | 'delivery') {
    if (type === 'pickup') {
      return this.prisma.pickupSlot.findMany({ where: { isActive: true }, orderBy: { startTime: 'asc' } });
    }
    return this.prisma.deliverySlot.findMany({ where: { isActive: true }, orderBy: { startTime: 'asc' } });
  }
}
