import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArchiveLogService } from 'src/archive-logs/archive-log.service';
import { DefenseSchedule } from 'src/entities/defense-schedule.entity';
import {
  CreateDefenseScheduleDto,
  FilterDefenseScheduleDto,
  UpdateDefenseScheduleDto,
} from 'src/dto';


@Injectable()
export class DefenseScheduleService {
  constructor(
    @InjectRepository(DefenseSchedule)
    private readonly scheduleRepo: Repository<DefenseSchedule>,
    private readonly archiveLogService: ArchiveLogService,
  ) { }
  
  private async checkConflicts(
    startTime: string | Date,
    endTime: string | Date,
    roomId: number,
    facultyIds: number[],
    excludeScheduleId?: number,
  ): Promise<void> {
    const formattedStart = startTime instanceof Date ? startTime.toISOString() : startTime;
    const formattedEnd = endTime instanceof Date ? endTime.toISOString() : endTime;
    const timeRangeString = `${formattedStart} to ${formattedEnd}`;

    const query = this.scheduleRepo
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.panelAssignments', 'panelAssignment')
      .leftJoinAndSelect('panelAssignment.faculty', 'faculty')
      .where(
        '(schedule.startTime, schedule.endTime) OVERLAPS (:startTime::timestamp, :endTime::timestamp)',
        { startTime: formattedStart, endTime: formattedEnd },
      );

    if (excludeScheduleId) {
      query.andWhere('schedule.id != :excludeScheduleId', { excludeScheduleId });
    }

    const overlappingSchedules = await query.getMany();

    for (const conflict of overlappingSchedules) {
      // Check Room Double-Booking
      if (conflict.roomId === roomId) {
        const message = `Room double-booking conflict detected for Room #${roomId}`;
        await this.logBlockedAttempt('ROOM_CONFLICT', message, { roomId, timeRangeString });

      }

      // Check Faculty Availability
      if (conflict.panelAssignments && facultyIds?.length > 0) {
        const conflictingAssignment = conflict.panelAssignments.find((pa) =>
          facultyIds.includes(pa.facultyId),
        );

        if (conflictingAssignment) {
          const facultyName = conflictingAssignment.faculty?.fullName || `Faculty ID #${conflictingAssignment.facultyId}`;
          const message = `Faculty conflict detected: ${facultyName} is already assigned to a defense schedule at this time.`;
          await this.logBlockedAttempt('FACULTY_CONFLICT', message, { facultyId: conflictingAssignment.facultyId, timeRangeString });

        }
      }
    }
  }

  private async logBlockedAttempt(type: string, message: string, metadata: any) {
    try {
      await this.archiveLogService.create({
        entityType: 'DefenseScheduleConflict',
        entityId: metadata.roomId || metadata.facultyId || 0,
        action: `BLOCKED_${type}`,
        newValues: { reason: message, conflictDetails: metadata },
      });
    } catch (logError) {
      console.error('Failed writing conflict attempt to archive-logs:', logError);
    }
  }

  async create(dto: CreateDefenseScheduleDto): Promise<DefenseSchedule> {
    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException('startTime must be before endTime');
    }

    await this.checkConflicts(dto.startTime, dto.endTime, dto.roomId, dto.facultyIds);

    const schedule = this.scheduleRepo.create(dto);
    return this.scheduleRepo.save(schedule);
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
    const schedule = await this.scheduleRepo.findOne({ where: { id }, relations: ['room','panelAssignments', 'panelAssignments.faculty'] });
    if (!schedule) throw new NotFoundException(`Defense schedule #${id} not found`);
    return schedule;
  }

  async update(id: number, dto: UpdateDefenseScheduleDto): Promise<DefenseSchedule> {
    const schedule = await this.findOne(id);

    const newStart = dto.startTime ?? schedule.startTime;
    const newEnd = dto.endTime ?? schedule.endTime;
    if (newStart >= newEnd) {
      throw new BadRequestException('startTime must be before endTime');
    }

    const targetRoomId = dto.roomId ?? schedule.roomId;
    const targetFacultyIds = dto.facultyIds ?? schedule.panelAssignments?.map(pa => pa.facultyId) ?? [];

    await this.checkConflicts(newStart, newEnd, targetRoomId, targetFacultyIds, id);
    Object.assign(schedule, dto);
    return this.scheduleRepo.save(schedule);
  }

  async remove(id: number): Promise<{ message: string }> {
    const schedule = await this.findOne(id);
    await this.scheduleRepo.remove(schedule);
    return { message: `Defense schedule #${id} deleted successfully` };
  }

  
}