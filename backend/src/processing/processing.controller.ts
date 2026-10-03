import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProcessingService } from './processing.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { JwtPayload } from '@cleancare/types';

@ApiTags('Processing')
@ApiBearerAuth()
@Controller('processing')
export class ProcessingController {
  constructor(private readonly svc: ProcessingService) {}

  @Get()
  @Roles('ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER','PROCESSING_MANAGER')
  findAll(@Query() q: any) { return this.svc.findAll(q); }

  @Post(':orderId/receive')
  @Roles('ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER','PROCESSING_MANAGER')
  receive(@Param('orderId') id: string, @CurrentUser() u: JwtPayload, @Body() dto: any) {
    return this.svc.receiveOrder(id, { ...dto, receivedBy: u.sub });
  }

  @Put(':orderId/stage')
  @Roles('ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER','PROCESSING_MANAGER','QC_USER')
  stage(@Param('orderId') id: string, @CurrentUser() u: JwtPayload, @Body() dto: { stage: string }) {
    return this.svc.advanceStage(id, dto.stage, u.sub);
  }
}
