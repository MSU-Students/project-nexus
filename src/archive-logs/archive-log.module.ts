import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchiveLogController } from './archive-log.controller';
import { ArchiveLogService } from './archive-log.service';
import { ArchiveLog } from './archive-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArchiveLog])],
  controllers: [ArchiveLogController],
  providers: [ArchiveLogService],
  exports: [ArchiveLogService],
})
export class ArchiveLogModule {}
