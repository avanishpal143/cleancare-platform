import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SupportService } from './support.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { JwtPayload } from '@cleancare/types';

@ApiTags('Support')
@ApiBearerAuth()
@Controller('support')
export class SupportController {
  constructor(private readonly svc: SupportService) {}

  @Post('tickets')
  @Roles('CUSTOMER')
  create(@CurrentUser() u: JwtPayload, @Body() dto: any) { return this.svc.create(u.customerId!, dto); }

  @Get('tickets/mine')
  @Roles('CUSTOMER')
  mine(@CurrentUser() u: JwtPayload) { return this.svc.findByCustomer(u.customerId!); }

  @Get('tickets')
  @Roles('ADMIN','SUPER_ADMIN','SUPPORT_AGENT')
  all(@Query() q: any) { return this.svc.findAll(q); }

  @Get('tickets/:id')
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post('tickets/:id/messages')
  addMsg(@Param('id') id: string, @CurrentUser() u: JwtPayload, @Body() dto: any) {
    return this.svc.addMessage(id, u.sub, u.role, dto.message, dto.isInternal);
  }

  @Put('tickets/:id/status')
  @Roles('ADMIN','SUPER_ADMIN','SUPPORT_AGENT')
  updateStatus(@Param('id') id: string, @Body() dto: { status: string }) {
    return this.svc.updateStatus(id, dto.status);
  }
}
