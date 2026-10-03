import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { Roles, Public } from '../common/decorators/roles.decorator';

@ApiTags('Offers')
@ApiBearerAuth()
@Controller('offers')
export class OffersController {
  constructor(private readonly svc: OffersService) {}

  @Public() @Get('active') active() { return this.svc.findActive(); }

  @Get() @Roles('ADMIN','SUPER_ADMIN') findAll() { return this.svc.findAll(); }

  @Post('coupons/validate')
  validate(@Body() dto: { code: string; serviceId?: string; amount?: number }) {
    return this.svc.validate(dto.code, dto.serviceId, dto.amount);
  }

  @Post() @Roles('ADMIN','SUPER_ADMIN') create(@Body() dto: any) { return this.svc.create(dto); }
  @Put(':id') @Roles('ADMIN','SUPER_ADMIN') update(@Param('id') id: string, @Body() dto: any) { return this.svc.update(id, dto); }
  @Delete(':id') @Roles('ADMIN','SUPER_ADMIN') remove(@Param('id') id: string) { return this.svc.delete(id); }
}
