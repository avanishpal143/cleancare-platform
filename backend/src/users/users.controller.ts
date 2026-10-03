import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly svc: UsersService) {}

  @Get()    @Roles('ADMIN','SUPER_ADMIN') findAll(@Query() q: any) { return this.svc.findAll(q); }
  @Get(':id') @Roles('ADMIN','SUPER_ADMIN') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Post()   @Roles('SUPER_ADMIN') create(@Body() dto: any) { return this.svc.create(dto); }
  @Put(':id') @Roles('ADMIN','SUPER_ADMIN') update(@Param('id') id: string, @Body() dto: any) { return this.svc.update(id, dto); }
  @Put(':id/toggle-active') @Roles('ADMIN','SUPER_ADMIN')
  toggle(@Param('id') id: string, @Body() dto: { isActive: boolean }) { return this.svc.toggleActive(id, dto.isActive); }
}
