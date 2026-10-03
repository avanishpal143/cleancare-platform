import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { JwtPayload } from '@cleancare/types';

@ApiTags('Drivers')
@ApiBearerAuth()
@Controller('drivers')
export class DriversController {
  constructor(private readonly svc: DriversService) {}

  // ---- Driver self ----
  @Get('me')
  @Roles('DRIVER')
  me(@CurrentUser() u: JwtPayload) { return this.svc.findByUserId(u.sub); }

  @Get('me/dashboard')
  @Roles('DRIVER')
  dashboard(@CurrentUser() u: JwtPayload) {
    return this.svc.getDashboard(u.driverId!);
  }

  @Get('me/jobs')
  @Roles('DRIVER')
  jobs(@CurrentUser() u: JwtPayload, @Query('type') type?: 'PICKUP' | 'DELIVERY') {
    return this.svc.getJobs(u.driverId!, type);
  }

  @Get('me/earnings')
  @Roles('DRIVER')
  earnings(@CurrentUser() u: JwtPayload) { return this.svc.getEarnings(u.driverId!); }

  // ---- Pickup flow ----
  @Put('pickup/:jobId/start')
  @Roles('DRIVER')
  startPickup(@Param('jobId') id: string, @CurrentUser() u: JwtPayload) {
    return this.svc.startPickup(id, u.driverId!);
  }

  @Post('pickup/:jobId/confirm')
  @Roles('DRIVER')
  confirmPickup(@Param('jobId') id: string, @CurrentUser() u: JwtPayload, @Body() dto: any) {
    return this.svc.confirmPickup(id, u.driverId!, dto);
  }

  // ---- Delivery flow ----
  @Put('delivery/:jobId/start')
  @Roles('DRIVER')
  startDelivery(@Param('jobId') id: string, @CurrentUser() u: JwtPayload) {
    return this.svc.startDelivery(id, u.driverId!);
  }

  @Post('delivery/:jobId/confirm')
  @Roles('DRIVER')
  confirmDelivery(@Param('jobId') id: string, @CurrentUser() u: JwtPayload, @Body() dto: any) {
    return this.svc.confirmDelivery(id, u.driverId!, dto);
  }

  // ---- Admin ----
  @Get()
  @Roles('ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER')
  findAll(@Query() q: any) { return this.svc.findAll(q); }

  @Get(':id')
  @Roles('ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER')
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }
}
