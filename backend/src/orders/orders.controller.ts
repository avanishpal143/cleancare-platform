import {
  Controller, Get, Post, Put, Delete, Body, Param,
  Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, IsArray, IsEnum, IsOptional, IsInt, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { OrdersService } from './orders.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { JwtPayload, PaymentMethod, OrderStatus } from '@cleancare/types';
import { PaginationDto } from '../common/dto/pagination.dto';

class OrderItemDto {
  @IsString() garmentId: string;
  @IsInt() @Min(1) @Type(() => Number) quantity: number;
  @IsOptional() @IsString() notes?: string;
}

class CreateOrderBody {
  @IsString() serviceId: string;
  @IsArray() items: OrderItemDto[];
  @IsString() pickupAddressId: string;
  @IsString() deliveryAddressId: string;
  @IsDateString() pickupDate: string;
  @IsString() pickupSlotLabel: string;
  @IsOptional() @IsDateString() deliveryDate?: string;
  @IsOptional() @IsString() deliverySlotLabel?: string;
  @IsOptional() @IsString() specialInstructions?: string;
  @IsString() paymentMethod: PaymentMethod;
  @IsOptional() @IsString() couponCode?: string;
}

class EstimateBody {
  @IsString() serviceId: string;
  @IsArray() items: { garmentId: string; quantity: number }[];
}

class UpdateStatusBody {
  @IsString() status: OrderStatus;
  @IsOptional() @IsString() notes?: string;
}

class AssignDriverBody {
  @IsString() driverId: string;
}

class CancelBody {
  @IsString() reason: string;
}

class OrderQueryDto extends PaginationDto {
  @IsOptional() @IsString() status?: OrderStatus;
  @IsOptional() @IsString() serviceId?: string;
  @IsOptional() @IsString() paymentStatus?: string;
  @IsOptional() @IsString() driverId?: string;
  @IsOptional() @IsDateString() dateFrom?: string;
  @IsOptional() @IsDateString() dateTo?: string;
}

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly svc: OrdersService) {}

  // ---- Customer ----

  @Post()
  @Roles('CUSTOMER')
  @ApiOperation({ summary: 'Create new order' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateOrderBody) {
    return this.svc.create(user.customerId!, dto as any);
  }

  @Post('estimate')
  @Roles('CUSTOMER')
  estimate(@Body() dto: EstimateBody) {
    return this.svc.estimatePrice(dto.serviceId, dto.items);
  }

  @Get('customer/me')
  @Roles('CUSTOMER')
  myOrders(@CurrentUser() user: JwtPayload, @Query() q: OrderQueryDto) {
    return this.svc.findByCustomer(user.customerId!, q);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.svc.findById(id, user.sub, user.role);
  }

  // ---- Admin / Operations ----

  @Get()
  @Roles('ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER','FINANCE_USER','SUPPORT_AGENT')
  findAll(@Query() q: OrderQueryDto) {
    return this.svc.findAll(q);
  }

  @Put(':id/status')
  @Roles('ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER','PROCESSING_MANAGER','QC_USER','DRIVER')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusBody,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.updateStatus(id, dto.status, user.sub, user.role, dto.notes);
  }

  @Put(':id/assign-pickup-driver')
  @Roles('ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER')
  assignPickup(
    @Param('id') id: string,
    @Body() dto: AssignDriverBody,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.assignPickupDriver(id, dto.driverId, user.sub, user.role);
  }

  @Put(':id/assign-delivery-driver')
  @Roles('ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER')
  assignDelivery(
    @Param('id') id: string,
    @Body() dto: AssignDriverBody,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.assignDeliveryDriver(id, dto.driverId, user.sub, user.role);
  }

  @Put(':id/cancel')
  @Roles('ADMIN','SUPER_ADMIN','OPERATIONS_MANAGER','CUSTOMER')
  cancel(
    @Param('id') id: string,
    @Body() dto: CancelBody,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.svc.cancel(id, dto.reason, user.sub, user.role);
  }
}
