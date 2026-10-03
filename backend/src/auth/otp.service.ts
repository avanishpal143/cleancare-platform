import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import * as crypto from 'crypto';
@Injectable()
export class OtpService {
  private readonly logger      = new Logger(OtpService.name);
  private readonly devMode:    boolean;
  private readonly testOtp:    string;
  private readonly expiry:     number;
  private readonly maxAttempts:number;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.devMode     = config.get<string>('OTP_DEV_MODE', 'true') === 'true';
    this.testOtp     = config.get<string>('OTP_TEST_CODE', '123456');
    this.expiry      = config.get<number>('OTP_EXPIRY_MINUTES', 10);
    this.maxAttempts = config.get<number>('OTP_MAX_ATTEMPTS', 5);
  }

  async sendOtp(mobile: string, userId?: string): Promise<void> {
    try {
      // Invalidate old OTPs
      await this.prisma.otpRequest.updateMany({
        where: { mobile, isUsed: false },
        data:  { isUsed: true },
      });

      const otp       = this.devMode ? this.testOtp : this.generateOtp();
      const expiresAt = new Date(Date.now() + this.expiry * 60 * 1000);

      await this.prisma.otpRequest.create({
        data: { mobile, userId: userId ?? null, otp, expiresAt },
      });

      if (this.devMode) {
        this.logger.log(`[DEV] OTP for ${mobile}: ${otp}`);
      } else {
        await this.sendViaSms(mobile, otp);
      }
    } catch (err) {
      this.logger.error('sendOtp failed:', err);
      throw err;
    }
  }

  async verifyOtp(mobile: string, otp: string): Promise<boolean> {
    // In dev mode with test OTP — always valid
    if (this.devMode && otp === this.testOtp) {
      this.logger.log(`[DEV] OTP verified for ${mobile}`);
      return true;
    }

    const record = await this.prisma.otpRequest.findFirst({
      where: {
        mobile,
        isUsed:    false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) return false;

    await this.prisma.otpRequest.update({
      where: { id: record.id },
      data:  { attempts: { increment: 1 } },
    });

    if (record.attempts >= this.maxAttempts) {
      await this.prisma.otpRequest.update({
        where: { id: record.id },
        data:  { isUsed: true },
      });
      return false;
    }

    if (otp !== record.otp) return false;

    await this.prisma.otpRequest.update({
      where: { id: record.id },
      data:  { isUsed: true },
    });

    return true;
  }

  private generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  private async sendViaSms(mobile: string, otp: string): Promise<void> {
    this.logger.warn(`SMS not configured — OTP for ${mobile}: ${otp}`);
  }
}
