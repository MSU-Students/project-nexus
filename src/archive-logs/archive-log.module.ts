import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchiveLog } from 'src/entities/archive-log.entity';
import { ArchiveLogController } from './archive-log.controller';
import { ArchiveLogService } from './archive-log.service';

@Module({
    imports: [TypeOrmModule.forFeature([ArchiveLog])],
    controllers: [ArchiveLogController],
    providers: [ArchiveLogService],
    exports: [ArchiveLogService],
})
export class ArchiveLogModule {}
