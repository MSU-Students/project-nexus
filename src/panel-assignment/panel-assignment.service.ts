import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PanelAssignment } from 'src/entities/panel-assignment.entity';
import { User } from 'src/entities/user.entity';
import { AssignPanelDto, RemovePanelDto } from 'src/dto';
import { Role } from 'src/enums';

const MIN_PANELISTS = 2;
const MAX_PANELISTS = 5;

@Injectable()
export class PanelAssignmentService {
  constructor(
    @InjectRepository(PanelAssignment)
    private readonly panelRepo: Repository<PanelAssignment>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  async assign(dto: AssignPanelDto): Promise<PanelAssignment> {
    // 1. Check faculty exists and is FACULTY role
    const faculty = await this.userRepo.findOne({ where: { id: dto.facultyId } });
    if (!faculty) throw new NotFoundException(`User #${dto.facultyId} not found`);
    if (faculty.role !== Role.FACULTY) {
      throw new BadRequestException(`User #${dto.facultyId} is not a faculty member`);
    }

    // 2. Check max panelists
    const currentCount = await this.panelRepo.count({
      where: { schedule: { id: dto.scheduleId } },
    });
    if (currentCount >= MAX_PANELISTS) {
      throw new BadRequestException(
        `A defense schedule can have a maximum of ${MAX_PANELISTS} panelists`,
      );
    }

    // 3. Check duplicate
    const existing = await this.panelRepo.findOne({
      where: {
        schedule: { id: dto.scheduleId },
        faculty: { id: dto.facultyId },
      },
    });
    if (existing) {
      throw new BadRequestException(
        `Faculty #${dto.facultyId} is already assigned to this defense`,
      );
    }

    // 4. Save — use plain object for schedule since entity may not exist in this branch
    const assignment = this.panelRepo.create({
      schedule: { id: dto.scheduleId } as any,
      faculty,
    });
    return this.panelRepo.save(assignment);
  }

  async remove(dto: RemovePanelDto): Promise<{ message: string }> {
    const currentCount = await this.panelRepo.count({
      where: { schedule: { id: dto.scheduleId } },
    });
    if (currentCount <= MIN_PANELISTS) {
      throw new BadRequestException(
        `Cannot remove panelist — a defense must have at least ${MIN_PANELISTS} panelists`,
      );
    }

    const assignment = await this.panelRepo.findOne({
      where: {
        schedule: { id: dto.scheduleId },
        faculty: { id: dto.facultyId },
      },
    });
    if (!assignment) {
      throw new NotFoundException(
        `Faculty #${dto.facultyId} is not assigned to schedule #${dto.scheduleId}`,
      );
    }

    await this.panelRepo.remove(assignment);
    return { message: `Faculty #${dto.facultyId} removed from schedule #${dto.scheduleId}` };
  }

  async findBySchedule(scheduleId: number): Promise<PanelAssignment[]> {
    return this.panelRepo.find({
      where: { schedule: { id: scheduleId } },
      order: { assignedAt: 'ASC' },
    });
  }
}