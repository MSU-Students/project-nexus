import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdviserAssignment } from 'src/entities/adviser-assignment.entity';
import { Adviser } from 'src/entities/adviser.entity';
import { CreateAssignmentDto } from 'src/dto/create-assignment.dto';

const DEFAULT_MAX_GROUPS = 5;

@Injectable()
export class AdvisorAdviseeAssignmentService {
    constructor(
        @InjectRepository(AdviserAssignment)
        private readonly assignmentRepository: Repository<AdviserAssignment>,

        @InjectRepository(Adviser)
        private readonly adviserRepository: Repository<Adviser>,
    ) {}

    async create(dto: CreateAssignmentDto, assignedBy?: number): Promise<AdviserAssignment> {

        const adviser = await this.adviserRepository.findOne({
            where: { id: dto.adviserId },
        });
        if (!adviser) {
            throw new NotFoundException(`Adviser #${dto.adviserId} not found`);
        }

        const maxGroups = adviser.maxGroups ?? DEFAULT_MAX_GROUPS;

        const currentGroupCount = await this.assignmentRepository.count({
            where: { adviserId: dto.adviserId },
        });

        if (currentGroupCount >= maxGroups) {
            throw new BadRequestException(
                `Adviser #${dto.adviserId} has reached the maximum capacity of ${maxGroups} group(s) ` +
                `and cannot be assigned to more groups.`,
            );
        }

        const existingAssignment = await this.assignmentRepository.findOne({
            where: { groupId: dto.groupId },
        });

        if (existingAssignment) {
            throw new BadRequestException(
                `Group #${dto.groupId} already has an assigned adviser (Assignment #${existingAssignment.id}). ` +
                `Please remove the current adviser before assigning a new one.`,
            );
        }

        const assignment = this.assignmentRepository.create({
            adviserId: dto.adviserId,
            groupId: dto.groupId,
            assignedBy: assignedBy ?? dto.assignedBy,
        });
        return this.assignmentRepository.save(assignment);
    }

    async getGroupsByAdviser(adviserId: number): Promise<AdviserAssignment[]> {
        return this.assignmentRepository.find({
            where: { adviserId },
            relations: ['group'],
            order: { assignedAt: 'DESC' },
        });
    }

    async getAdviserByGroup(groupId: number): Promise<AdviserAssignment> {
        const results = await this.assignmentRepository.find({
            where: { groupId },
            relations: ['adviser', 'adviser.faculty'],
            order: { assignedAt: 'DESC' },
            take: 1,
        });
        if (!results.length) throw new NotFoundException(`No adviser assigned to group #${groupId}`);
        return results[0];
    }

    async remove(id: number): Promise<void> {
        const assignment = await this.assignmentRepository.findOne({ where: { id } });
        if (!assignment) throw new NotFoundException(`Assignment #${id} not found`);
        await this.assignmentRepository.remove(assignment);
    }

    async getAdviserIdByUserId(userId: number): Promise<number> {
        const adviser = await this.adviserRepository.findOne({
            where: { facultyId: userId },
        });
        if (!adviser) {
            throw new NotFoundException(
                `No adviser record found for user #${userId}. ` +
                `Ensure this faculty member has an adviser profile.`,
            );
        }
        return adviser.id;
    }
}
 
