import { Module } from '@nestjs/common';
import { ProcessingController } from './processing.controller';
import { ProcessingService } from './processing.service';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports:     [AuditModule],
  controllers: [ProcessingController],
  providers:   [ProcessingService],
  exports:     [ProcessingService],
})
export class ProcessingModule {}
