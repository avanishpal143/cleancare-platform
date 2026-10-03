import { Controller, Get, Put, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { JwtPayload } from '@cleancare/types';

@ApiTags('Customers')
@ApiBearerAuth()
@Controller(['customer', 'customers'])
export class CustomersController {
  constructor(private readonly svc: CustomersService) {}

  @Get('me')
  @Roles('CUSTOMER')
  me(@CurrentUser() u: JwtPayload) { return this.svc.findMe(u.sub); }

  @Put('me')
  @Roles('CUSTOMER')
  update(@CurrentUser() u: JwtPayload, @Body() dto: any) { return this.svc.update(u.sub, dto); }

  @Get('addresses')
  @Roles('CUSTOMER')
  getAddresses(@CurrentUser() u: JwtPayload) { return this.svc.getAddresses(u.customerId!); }

  @Post('addresses')
  @Roles('CUSTOMER')
  addAddress(@CurrentUser() u: JwtPayload, @Body() dto: any) {
    return this.svc.createAddress(u.customerId!, dto);
  }

  @Put('addresses/:id')
  @Roles('CUSTOMER')
  updateAddr(@CurrentUser() u: JwtPayload, @Param('id') id: string, @Body() dto: any) {
    return this.svc.updateAddress(u.customerId!, id, dto);
  }

  @Delete('addresses/:id')
  @Roles('CUSTOMER')
  deleteAddr(@CurrentUser() u: JwtPayload, @Param('id') id: string) {
    return this.svc.deleteAddress(u.customerId!, id);
  }

  // Admin
  @Get()
  @Roles('ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER','SUPPORT_AGENT')
  findAll(@Query() q: any) { return this.svc.findAll(q); }
}
