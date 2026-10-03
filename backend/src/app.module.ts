import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';

import { DatabaseModule }      from './database/database.module';
import { AuthModule }          from './auth/auth.module';
import { UsersModule }         from './users/users.module';
import { CustomersModule }     from './customers/customers.module';
import { DriversModule }       from './drivers/drivers.module';
import { ServicesModule }      from './services/services.module';
import { GarmentsModule }      from './garments/garments.module';
import { OrdersModule }        from './orders/orders.module';
import { PaymentsModule }      from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SupportModule }       from './support/support.module';
import { ReportsModule }       from './reports/reports.module';
import { ProcessingModule }    from './processing/processing.module';
import { QcModule }            from './qc/qc.module';
import { OffersModule }        from './offers/offers.module';
import { SettingsModule }      from './settings/settings.module';
import { AuditModule }         from './audit/audit.module';
import { AdminModule }         from './admin/admin.module';
import { StorageModule }       from './storage/storage.module';
import { JwtAuthGuard }        from './common/guards/jwt-auth.guard';
import { RolesGuard }          from './common/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../.env'] }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CustomersModule,
    DriversModule,
    ServicesModule,
    GarmentsModule,
    OrdersModule,
    PaymentsModule,
    NotificationsModule,
    SupportModule,
    ReportsModule,
    ProcessingModule,
    QcModule,
    OffersModule,
    SettingsModule,
    AuditModule,
    AdminModule,
    StorageModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
