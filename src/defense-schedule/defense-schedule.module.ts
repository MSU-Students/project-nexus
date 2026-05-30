import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefenseSchedule } from 'src/entities/defense-schedule.entity';
import { DefenseScheduleController } from './defense-schedule.controller';
import { DefenseScheduleService } from './defense-schedule.service';

@Module({
  imports: [TypeOrmModule.forFeature([DefenseSchedule])],
  controllers: [DefenseScheduleController],
  providers: [DefenseScheduleService],
  exports: [DefenseScheduleService], // exported so Task 2 (panel module) can use it later
})
export class DefenseScheduleModule {}
