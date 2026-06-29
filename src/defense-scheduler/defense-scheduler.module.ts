import { Module } from '@nestjs/common';
import { DefenseSchedulerService } from './defense-scheduler.service';
import { DefenseSchedulerController } from './defense-scheduler.controller';

@Module({
  controllers: [DefenseSchedulerController],
  providers: [DefenseSchedulerService],
})
export class DefenseSchedulerModule {}
