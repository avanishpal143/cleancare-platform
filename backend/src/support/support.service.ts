import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

let ticketCounter = 1000;
function generateTicketNumber() { return `TKT-${++ticketCounter}`; }

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async create(customerId: string, dto: any) {
    return this.prisma.supportTicket.create({
      data: { ...dto, customerId, ticketNumber: generateTicketNumber(), status: 'OPEN' },
    });
  }

  async findByCustomer(customerId: string) {
    return this.prisma.supportTicket.findMany({
      where:   { customerId },
      orderBy: { createdAt: 'desc' },
      include: { messages: true },
    });
  }

  async findAll(params: any) {
    const { page = 1, limit = 20, status } = params;
    const where: any = {};
    if (status) where.status = status;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.supportTicket.findMany({
        where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' },
        include: { customer: true },
      }),
      this.prisma.supportTicket.count({ where }),
    ]);
    return { items, total };
  }

  async findOne(id: string) {
    const t = await this.prisma.supportTicket.findUnique({ where: { id }, include: { messages: true, customer: true } });
    if (!t) throw new NotFoundException('Ticket not found');
    return t;
  }

  async addMessage(ticketId: string, senderId: string, senderRole: any, message: string, isInternal = false) {
    return this.prisma.ticketMessage.create({
      data: { ticketId, senderId, senderRole, message, isInternal },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.supportTicket.update({ where: { id }, data: { status: status as any } });
  }
}
