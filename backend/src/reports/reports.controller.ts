import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly svc: ReportsService) {}

  @Get('dashboard')
  @Roles('ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER','FINANCE_USER')
  dashboard() { return this.svc.getDashboardKPIs(); }

  @Get('orders-chart')
  @Roles('ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER','FINANCE_USER')
  ordersChart(@Query('days') days?: number) { return this.svc.getOrdersChart(days ?? 7); }

  @Get('orders-by-service')
  @Roles('ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER','FINANCE_USER')
  byService() { return this.svc.getOrdersByService(); }

  @Get('order-status-distribution')
  @Roles('ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER','FINANCE_USER')
  statusDist() { return this.svc.getOrderStatusDistribution(); }

  @Get('recent-orders')
  @Roles('ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER')
  recent(@Query('limit') limit?: number) { return this.svc.getRecentOrders(limit ?? 5); }

  @Get('driver-performance')
  @Roles('ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER')
  driverPerf(@Query() q: any) { return this.svc.getDriverPerformance(q); }
}
