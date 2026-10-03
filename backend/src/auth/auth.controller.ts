import { Controller, Post, Body, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IsString, Matches, Length, IsOptional, IsEmail } from 'class-validator';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '@cleancare/types';

// ---- DTOs ----
class SendOtpDto {
  @Matches(/^[6-9]\d{9}$/, { message: 'Invalid mobile number' })
  mobile: string;
}

class VerifyOtpDto {
  @Matches(/^[6-9]\d{9}$/)
  mobile: string;

  @Length(6, 6)
  otp: string;
}

class CompleteProfileDto {
  @IsString()
  @Length(2, 80)
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authSvc: AuthService) {}

  @Public()
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP to mobile' })
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authSvc.sendOtp(dto.mobile);
  }

  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and login/register' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authSvc.verifyOtp(dto.mobile, dto.otp);
  }

  @Post('complete-profile')
  @ApiOperation({ summary: 'Complete new user registration' })
  completeProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CompleteProfileDto,
  ) {
    return this.authSvc.completeProfile(user.sub, dto.name, dto.email);
  }

  @Public()
  @Post('driver/send-otp')
  @HttpCode(HttpStatus.OK)
  driverSendOtp(@Body() dto: SendOtpDto) {
    return this.authSvc.sendOtp(dto.mobile);
  }

  @Public()
  @Post('driver/verify-otp')
  @HttpCode(HttpStatus.OK)
  driverVerifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authSvc.driverLogin(dto.mobile, dto.otp);
  }

  @Public()
  @Post('admin/send-otp')
  @HttpCode(HttpStatus.OK)
  adminSendOtp(@Body() dto: SendOtpDto) {
    return this.authSvc.sendOtp(dto.mobile);
  }

  @Public()
  @Post('admin/verify-otp')
  @HttpCode(HttpStatus.OK)
  adminVerifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authSvc.adminLogin(dto.mobile, dto.otp);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authSvc.refreshToken(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Body() dto: RefreshTokenDto) {
    return this.authSvc.logout(dto.refreshToken);
  }
}
