import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) { }

  async create(dto: CreateDefenseScheduleDto): Promise<DefenseSchedule> {
    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException('startTime must be before endTime');
    }
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
    const schedule = await this.scheduleRepo.findOne({ where: { id } });
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

    Object.assign(schedule, dto);
    return this.scheduleRepo.save(schedule);
  }

  async remove(id: number): Promise<{ message: string }> {
    const schedule = await this.findOne(id);
    await this.scheduleRepo.remove(schedule);
    return { message: `Defense schedule #${id} deleted successfully` };
  }
}