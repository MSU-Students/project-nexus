import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdviserAssignment } from 'src/entities/adviser-assignment.entity';
import { CreateAssignmentDto } from 'src/dto/create-assignment.dto';

@Injectable()
export class AssignmentService {
    constructor(
        @InjectRepository(AdviserAssignment)
        private readonly assignmentRepository: Repository<AdviserAssignment>,
    ) { }

    // POST /assignments
    async create(dto: CreateAssignmentDto, assignedBy?: number): Promise<AdviserAssignment> {
        const assignment = this.assignmentRepository.create({
            adviserId: dto.adviserId,
            groupId: dto.groupId,
            assignedBy: assignedBy ?? dto.assignedBy,
        });
        return this.assignmentRepository.save(assignment);
    }

    // GET /advisers/:id/groups
    async getGroupsByAdviser(adviserId: number): Promise<AdviserAssignment[]> {
        return this.assignmentRepository.find({
            where: { adviserId },
            relations: ['group'],
            order: { assignedAt: 'DESC' },
        });
    }

    // GET /groups/:id/adviser
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

    // DELETE /assignments/:id
    async remove(id: number): Promise<void> {
        const assignment = await this.assignmentRepository.findOne({ where: { id } });
        if (!assignment) throw new NotFoundException(`Assignment #${id} not found`);
        await this.assignmentRepository.remove(assignment);
    }
}
