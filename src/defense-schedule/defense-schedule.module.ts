import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefenseSchedule } from 'src/entities/defense-schedule.entity';
import { PanelAssignment } from 'src/entities/panel-assignment.entity';
import { DefenseScheduleController } from './defense-schedule.controller';
import { DefenseScheduleService } from './defense-schedule.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DefenseSchedule, PanelAssignment]),
    NotificationModule,
  ],
  controllers: [DefenseScheduleController],
  providers: [DefenseScheduleService],
  exports: [DefenseScheduleService],
})
export class DefenseScheduleModule { }