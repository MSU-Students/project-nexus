import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DefenseSchedule, ScheduleStatus } from 'src/entities/defense-schedule.entity';
import {
  CreateDefenseScheduleDto,
  FilterDefenseScheduleDto,
  UpdateDefenseScheduleDto,
} from 'src/dto';
import { NotificationService } from 'src/notification/notification.service';
import { PanelAssignment } from 'src/entities/panel-assignment.entity';
import { ConfigService } from '@nestjs/config';
import {
  scheduleCreatedEmail,
  scheduleUpdatedEmail,
  scheduleCancelledEmail,
} from 'src/notification/email-templates';

@Injectable()
export class DefenseScheduleService {
  constructor(
    @InjectRepository(DefenseSchedule)
    private readonly scheduleRepo: Repository<DefenseSchedule>,

    @InjectRepository(PanelAssignment)
    private readonly panelRepo: Repository<PanelAssignment>,

    private readonly notificationService: NotificationService,
    private readonly config: ConfigService,
  ) { }

  // ── Helper: collect panelist emails for a schedule ──
  private async getPanelistEmails(scheduleId: number): Promise<string[]> {
    const assignments = await this.panelRepo.find({
      where: { schedule: { id: scheduleId } },
      relations: ['faculty'],
    });
    return assignments.map((a) => a.faculty?.email).filter(Boolean) as string[];
  }

  async create(dto: CreateDefenseScheduleDto): Promise<DefenseSchedule> {
    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException('startTime must be before endTime');
    }
    const schedule = this.scheduleRepo.create(dto);
    const saved = await this.scheduleRepo.save(schedule);

    // No panelists yet at creation time — notify coordinator or skip
    // You can add coordinator email here if needed

    return saved;
  }

  // Call this AFTER panelists are assigned (or you can call it from PanelAssignmentService)
  async notifyCreated(scheduleId: number): Promise<void> {
    const schedule = await this.findOne(scheduleId);
    const emails = await this.getPanelistEmails(scheduleId);
    const appUrl = this.config.get<string>('APP_URL', 'http://localhost:9000');

    if (emails.length > 0) {
      await this.notificationService.sendEmail({
        to: emails,
        subject: `New Defense Scheduled — ${schedule.defenseType} on ${schedule.date}`,
        html: scheduleCreatedEmail(schedule, appUrl),
        text: `A new ${schedule.defenseType} defense has been scheduled on ${schedule.date} at ${schedule.startTime} in room ${schedule.room}.`,
      });
    }
  }

  async findAll(filter: FilterDefenseScheduleDto): Promise<DefenseSchedule[]> {
    const query = this.scheduleRepo.createQueryBuilder('schedule');
    if (filter.defenseType) {
      query.andWhere('schedule.defenseType = :defenseType', {
        defenseType: filter.defenseType,
      });
    }
    if (filter.status) {
      query.andWhere('schedule.status = :status', { status: filter.status });
    }
    if (filter.date) {
      query.andWhere('schedule.date = :date', { date: filter.date });
    }
    query.orderBy('schedule.date', 'ASC').addOrderBy('schedule.startTime', 'ASC');
    return query.getMany();
  }

  async findOne(id: number): Promise<DefenseSchedule> {
    const schedule = await this.scheduleRepo.findOne({ where: { id } });
    if (!schedule)
      throw new NotFoundException(`Defense schedule #${id} not found`);
    return schedule;
  }

  async update(id: number, dto: UpdateDefenseScheduleDto): Promise<DefenseSchedule> {
    const schedule = await this.findOne(id);

    const newStart = dto.startTime ?? schedule.startTime;
    const newEnd = dto.endTime ?? schedule.endTime;
    if (newStart >= newEnd) {
      throw new BadRequestException('startTime must be before endTime');
    }

    const wasCancelled =
      dto.status === ScheduleStatus.CANCELLED &&
      schedule.status !== ScheduleStatus.CANCELLED;

    Object.assign(schedule, dto);
    const saved = await this.scheduleRepo.save(schedule);

    const emails = await this.getPanelistEmails(id);
    const appUrl = this.config.get<string>('APP_URL', 'http://localhost:9000');

    if (emails.length > 0) {
      if (wasCancelled) {
        await this.notificationService.sendEmail({
          to: emails,
          subject: `Defense Cancelled — ${saved.defenseType} on ${saved.date}`,
          html: scheduleCancelledEmail(saved),
          text: `The ${saved.defenseType} defense on ${saved.date} has been cancelled.`,
        });
      } else {
        await this.notificationService.sendEmail({
          to: emails,
          subject: `Defense Schedule Updated — ${saved.defenseType} on ${saved.date}`,
          html: scheduleUpdatedEmail(saved, appUrl),
          text: `The ${saved.defenseType} defense on ${saved.date} has been updated. Please check the portal.`,
        });
      }
    }

    return saved;
  }

  async remove(id: number): Promise<{ message: string }> {
    const schedule = await this.findOne(id);
    await this.scheduleRepo.remove(schedule);
    return { message: `Defense schedule #${id} deleted successfully` };
  }

  // ── Calendar endpoint: returns FullCalendar-shaped events ──
  async getCalendarEvents(userId: number, userRole: string): Promise<any[]> {
    const schedules = await this.scheduleRepo.find({
      order: { date: 'ASC', startTime: 'ASC' },
    });

    // Role-based filtering
    let filtered = schedules;

    if (userRole === 'adviser') {
      // Faculty only sees schedules where they are a panelist
      const assignments = await this.panelRepo.find({
        where: { faculty: { id: userId } },
        relations: ['schedule'],
      });
      const assignedIds = new Set(assignments.map((a) => a.schedule?.id));
      filtered = schedules.filter((s) => assignedIds.has(s.id));
    }
    // COORDINATOR sees all (no filter)
    // STUDENT filtering — add your own logic once student↔schedule relation is set up

    return filtered.map((s) => ({
      id: s.id,
      title: `${s.defenseType.replace(/_/g, ' ')} — ${s.room}`,
      start: `${s.date}T${s.startTime}`,
      end: `${s.date}T${s.endTime}`,
      color: this.colorForStatus(s.status),
      extendedProps: {
        defenseType: s.defenseType,
        room: s.room,
        status: s.status,
      },
    }));
  }

  private colorForStatus(status: ScheduleStatus): string {
    const map: Record<ScheduleStatus, string> = {
      [ScheduleStatus.SCHEDULED]: '#1a56db',
      [ScheduleStatus.ONGOING]: '#f59e0b',
      [ScheduleStatus.COMPLETED]: '#10b981',
      [ScheduleStatus.CANCELLED]: '#ef4444',
    };
    return map[status] ?? '#6b7280';
  }
}