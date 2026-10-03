import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GarmentsService } from './garments.service';
import { Public, Roles } from '../common/decorators/roles.decorator';

@ApiTags('Garments')
@ApiBearerAuth()
@Controller('garments')
export class GarmentsController {
  constructor(private readonly svc: GarmentsService) {}

  @Public()
  @Get()
  findAll(@Query('active') active?: string) { return this.svc.findAll(active === 'true'); }

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
}
