import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { DefenseSchedule, ScheduleStatus } from 'src/entities/defense-schedule.entity';
import { PanelAssignment } from 'src/entities/panel-assignment.entity';
import { NotificationService } from './notification.service';
import { scheduleReminderEmail } from './email-templates';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReminderService {
    private readonly logger = new Logger(ReminderService.name);

    constructor(
        @InjectRepository(DefenseSchedule)
        private scheduleRepo: Repository<DefenseSchedule>,

        @InjectRepository(PanelAssignment)
        private panelRepo: Repository<PanelAssignment>,

        private notificationService: NotificationService,
        private config: ConfigService,
    ) { }

    // Runs every day at 8:00 AM
    @Cron('0 8 * * *')
    async sendThreeDayReminders(): Promise<void> {
        this.logger.log('Running 3-day defense reminder cron job...');

        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3);
        const dateStr = targetDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'

        const upcoming = await this.scheduleRepo.find({
            where: {
                date: dateStr,
                status: ScheduleStatus.SCHEDULED,
            },
        });

        this.logger.log(`Found ${upcoming.length} schedule(s) on ${dateStr}`);

        const appUrl = this.config.get<string>('APP_URL', 'http://localhost:9000');

        for (const schedule of upcoming) {
            const assignments = await this.panelRepo.find({
                where: { schedule: { id: schedule.id } },
                relations: ['faculty'],
            });

            const emails = assignments
                .map((a) => a.faculty?.email)
                .filter(Boolean) as string[];

            if (emails.length === 0) continue;

            await this.notificationService.sendEmail({
                to: emails,
                subject: `Reminder: Defense in 3 Days — ${schedule.defenseType} on ${schedule.date}`,
                html: scheduleReminderEmail(schedule, appUrl),
                text: `Reminder: You have a ${schedule.defenseType} defense on ${schedule.date} at ${schedule.startTime} in ${schedule.room}.`,
            });
        }
    }
}
