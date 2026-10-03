import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from '../reports/reports.service';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly reports: ReportsService) {}

  @Get('overview')
  @Roles('ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER','FINANCE_USER')
  overview() {
    return Promise.all([
      this.reports.getDashboardKPIs(),
      this.reports.getOrdersChart(7),
      this.reports.getOrdersByService(),
      this.reports.getOrderStatusDistribution(),
      this.reports.getRecentOrders(5),
    ]).then(([kpis, chart, byService, statusDist, recentOrders]) => ({
      kpis, chart, byService, statusDist, recentOrders,
    }));
  }
}
