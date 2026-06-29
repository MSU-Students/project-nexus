import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationService } from './notification.service';
import { ReminderService } from './reminder.service';
import { DefenseSchedule } from 'src/entities/defense-schedule.entity';
import { PanelAssignment } from 'src/entities/panel-assignment.entity';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([DefenseSchedule, PanelAssignment]),
    ],
    providers: [NotificationService, ReminderService],
    exports: [NotificationService],
})
export class NotificationModule { }