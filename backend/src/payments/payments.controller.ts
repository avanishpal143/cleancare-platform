import {
  Controller, Post, Get, Put, Body, Param, Query,
  Headers, RawBodyRequest, Req, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles, Public } from '../common/decorators/roles.decorator';
import type { JwtPayload } from '@cleancare/types';

@ApiTags('Payments')
@Controller('orders')
export class PaymentsController {
  constructor(private readonly svc: PaymentsService) {}

  @Post(':orderId/payment/initiate')
  @ApiBearerAuth()
  @Roles('CUSTOMER')
  initiatePayment(@Param('orderId') id: string, @Body() dto: { method: string }) {
    return this.svc.initiatePayment(id, dto.method);
  }

  @Post(':orderId/payment/verify')
  @ApiBearerAuth()
  @Roles('CUSTOMER')
  verifyPayment(@Param('orderId') id: string, @Body() dto: any) {
    return this.svc.verifyPayment(id, dto);
  }

  @Public()
  @Post('webhooks/razorpay')
  @HttpCode(HttpStatus.OK)
  webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-razorpay-signature') sig: string,
  ) {
    return this.svc.handleWebhook(req.rawBody!, sig);
  }
}

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsAdminController {
  constructor(private readonly svc: PaymentsService) {}

  @Get()
  @Roles('ADMIN','SUPER_ADMIN','FINANCE_USER')
  findAll(@Query() q: any) { return this.svc.findAll(q); }

  @Put(':orderId/refund')
  @Roles('ADMIN','SUPER_ADMIN','FINANCE_USER')
  refund(@Param('orderId') id: string, @Body() dto: any, @CurrentUser() u: JwtPayload) {
    return this.svc.initiateRefund(id, dto.amount, dto.reason, u.sub);
  }
}
