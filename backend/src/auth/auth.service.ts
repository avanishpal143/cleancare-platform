import {
  Injectable, UnauthorizedException,
  BadRequestException, Logger,
} from '@nestjs/common';
import { JwtService }    from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { OtpService }    from './otp.service';
import * as crypto       from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma:  PrismaService,
    private jwt:     JwtService,
    private config:  ConfigService,
    private otpSvc:  OtpService,
  ) {}

  // ── Send OTP ─────────────────────────────────────────────
  async sendOtp(mobile: string): Promise<void> {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      throw new BadRequestException('Invalid mobile number');
    }
    const user = await this.prisma.user.findUnique({ where: { mobile } });
    await this.otpSvc.sendOtp(mobile, user?.id);
  }

  // ── Verify OTP (Customer) ────────────────────────────────
  async verifyOtp(mobile: string, otp: string) {
    const valid = await this.otpSvc.verifyOtp(mobile, otp);
    if (!valid) throw new UnauthorizedException('Invalid or expired OTP');

    let user = await this.prisma.user.findUnique({
      where:   { mobile },
      include: { customer: true },
    });

    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = await this.prisma.user.create({
        data: {
          mobile,
          role:        'CUSTOMER',
          isVerified:  true,
          lastLoginAt: new Date(),
        },
        include: { customer: true },
      });
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data:  { isVerified: true, lastLoginAt: new Date() },
      });
    }

    const tokens = await this.issueTokens(user.id, user.role as any);

    return {
      tokens,
      user:      this.sanitize(user),
      customer:  user.customer,
      isNewUser: isNewUser || !user.customer,
    };
  }

  // ── Complete Profile (new user) ──────────────────────────
  async completeProfile(userId: string, name: string, email?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();

    const [updatedUser, customer] = await Promise.all([
      this.prisma.user.update({ where: { id: userId }, data: { name, email } }),
      this.prisma.customer.upsert({
        where:  { userId },
        create: { userId, name, email, mobile: user.mobile },
        update: { name, email },
      }),
    ]);

    return { user: this.sanitize(updatedUser), customer };
  }

  // ── Driver Login ─────────────────────────────────────────
  async driverLogin(mobile: string, otp: string) {
    const valid = await this.otpSvc.verifyOtp(mobile, otp);
    if (!valid) throw new UnauthorizedException('Invalid or expired OTP');

    const user = await this.prisma.user.findFirst({
      where:   { mobile, role: 'DRIVER' },
      include: { driver: true },
    });

    if (!user?.driver)    throw new UnauthorizedException('Driver account not found');
    if (!user.isActive)   throw new UnauthorizedException('Account is inactive');
    if (!user.driver.isActive) throw new UnauthorizedException('Driver account is inactive');

    await this.prisma.user.update({
      where: { id: user.id },
      data:  { lastLoginAt: new Date() },
    });

    const tokens = await this.issueTokens(user.id, 'DRIVER', undefined, user.driver.id);
    return { tokens, user: this.sanitize(user), driver: user.driver };
  }

  // ── Admin Login ──────────────────────────────────────────
  async adminLogin(mobile: string, otp: string) {
    const valid = await this.otpSvc.verifyOtp(mobile, otp);
    if (!valid) throw new UnauthorizedException('Invalid or expired OTP');

    const adminRoles = ['SUPER_ADMIN','ADMIN','OPERATIONS_MANAGER','PROCESSING_MANAGER','QC_USER','SUPPORT_AGENT','FINANCE_USER'];
    const user = await this.prisma.user.findFirst({
      where: { mobile, role: { in: adminRoles as any } },
    });

    if (!user)          throw new UnauthorizedException('Staff account not found');
    if (!user.isActive) throw new UnauthorizedException('Account is inactive');

    await this.prisma.user.update({
      where: { id: user.id },
      data:  { lastLoginAt: new Date() },
    });

    const tokens = await this.issueTokens(user.id, user.role as any);
    return { tokens, user: this.sanitize(user) };
  }

  // ── Refresh Token ────────────────────────────────────────
  async refreshToken(refreshToken: string) {
    const session = await this.prisma.userSession.findUnique({
      where:   { refreshToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const tokens = await this.issueTokens(session.userId, session.user.role as any);
    await this.prisma.userSession.delete({ where: { id: session.id } });
    return tokens;
  }

  // ── Logout ───────────────────────────────────────────────
  async logout(refreshToken: string) {
    await this.prisma.userSession.deleteMany({ where: { refreshToken } }).catch(() => {});
  }

  // ── Helpers ───────────────────────────────────────────────
  private async issueTokens(
    userId: string,
    role: string,
    customerId?: string,
    driverId?: string,
  ) {
    const payload = { sub: userId, role, customerId, driverId };
    const jwtSecret     = this.config.get<string>('JWT_SECRET');
    const jwtExpires    = this.config.get<string>('JWT_EXPIRES_IN', '7d');
    const refreshSecret = this.config.get<string>('REFRESH_TOKEN_SECRET', jwtSecret!);
    const refreshExp    = this.config.get<string>('REFRESH_TOKEN_EXPIRES_IN', '30d');

    const accessToken  = this.jwt.sign(payload, { secret: jwtSecret, expiresIn: jwtExpires });
    const refreshToken = this.jwt.sign(payload, { secret: refreshSecret, expiresIn: refreshExp });

    // Store refresh session
    const daysMatch = refreshExp.match(/(\d+)d/);
    const days      = daysMatch ? parseInt(daysMatch[1]) : 30;

    await this.prisma.userSession.create({
      data: {
        userId,
        refreshToken,
        expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken, expiresIn: 7 * 24 * 3600 };
  }

  private sanitize(user: any) {
    const { ...safe } = user;
    return safe;
  }
}
