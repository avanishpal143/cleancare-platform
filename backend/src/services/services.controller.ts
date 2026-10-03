import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { Public, Roles } from '../common/decorators/roles.decorator';

@ApiTags('Services')
@ApiBearerAuth()
@Controller('services')
export class ServicesController {
  constructor(private readonly svc: ServicesService) {}

  @Public()
  @Get()
  findAll(@Query('active') active?: string) {
    return this.svc.findAll(active === 'true');
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @Roles('ADMIN','SUPER_ADMIN')
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Put(':id')
  @Roles('ADMIN','SUPER_ADMIN')
  update(@Param('id') id: string, @Body() dto: any) { return this.svc.update(id, dto); }

  @Delete(':id')
  @Roles('ADMIN','SUPER_ADMIN')
  delete(@Param('id') id: string) { return this.svc.delete(id); }

  @Put(':id/toggle-active')
  @Roles('ADMIN','SUPER_ADMIN')
  toggle(@Param('id') id: string, @Body() dto: { isActive: boolean }) {
    return this.svc.toggleActive(id, dto.isActive);
  }
}
