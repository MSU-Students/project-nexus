import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchiveLog } from 'src/entities/archive-log.entity';
import { ArchiveLogController } from './archive-log.controller';
import { ArchiveLogService } from './archive-log.service';
import { AdvisorMatchingAuditHelper } from 'src/Advisor_Matching_Audit/Advisor-Advisee_Matching_Audit';

@Module({
  imports: [TypeOrmModule.forFeature([ArchiveLog])],
  controllers: [ArchiveLogController],
  providers: [ArchiveLogService, AdvisorMatchingAuditHelper],
  exports: [ArchiveLogService, AdvisorMatchingAuditHelper],
})
export class ArchiveLogModule {}
