import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { QcService } from './qc.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { JwtPayload } from '@cleancare/types';

@ApiTags('QC')
@ApiBearerAuth()
@Controller('qc')
export class QcController {
  constructor(private readonly svc: QcService) {}

  @Post(':orderId')
  @Roles('ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER','PROCESSING_MANAGER','QC_USER')
  record(@Param('orderId') id: string, @CurrentUser() u: JwtPayload, @Body() dto: any) {
    return this.svc.recordQC(id, { ...dto, checkedBy: u.sub });
  }

  @Get(':orderId')
  @Roles('ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER','PROCESSING_MANAGER','QC_USER')
  findForOrder(@Param('orderId') id: string) { return this.svc.findForOrder(id); }
}
