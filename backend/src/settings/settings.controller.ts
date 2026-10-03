import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { Roles, Public } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '@cleancare/types';

@ApiTags('Settings')
@ApiBearerAuth()
@Controller('settings')
export class SettingsController {
  constructor(private readonly svc: SettingsService) {}

  @Public() @Get('public') publicSettings() { return this.svc.findPublic(); }

  @Get() @Roles('ADMIN','SUPER_ADMIN') findAll(@Query('category') cat?: string) { return this.svc.findAll(cat); }

  @Put(':key') @Roles('ADMIN','SUPER_ADMIN')
  set(@Param('key') key: string, @Body() dto: any, @CurrentUser() u: JwtPayload) {
    return this.svc.set(key, dto.value, dto.category, dto.isPublic, u.sub);
  }

  @Post('bulk') @Roles('ADMIN','SUPER_ADMIN')
  bulk(@Body() dto: { settings: any[] }, @CurrentUser() u: JwtPayload) {
    return this.svc.setBulk(dto.settings, u.sub);
  }
}

@ApiTags('Slots')
@Controller('slots')
export class SlotsController {
  constructor(private readonly svc: SettingsService) {}

  @Public()
  @Get()
  getSlots(@Query('type') type: 'pickup' | 'delivery') {
    return this.svc.findSlots(type ?? 'pickup');
  }
}
