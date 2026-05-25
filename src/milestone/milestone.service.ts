import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectMilestone } from 'src/entities/project-milestone.entity';
import { SubmissionFile } from 'src/entities/submission-file.entity';
import { CreateProjectMilestoneDto } from 'src/dto/create-project-milestone.dto';
import { RejectMilestoneDto } from 'src/dto/reject-milestone.dto';

@Injectable()
export class MilestoneService {
    constructor(
        @InjectRepository(ProjectMilestone)
        private readonly projectMilestoneRepository: Repository<ProjectMilestone>,

        @InjectRepository(SubmissionFile)
        private readonly submissionFileRepository: Repository<SubmissionFile>,
    ) {}

    // POST /projects/:id/milestones
    async addMilestone(
        projectId: number,
        dto: CreateProjectMilestoneDto,
    ): Promise<ProjectMilestone> {
        const entry = this.projectMilestoneRepository.create({
            projectId,
            milestoneId: dto.milestoneId,
            status: 'pending',
        });
        return this.projectMilestoneRepository.save(entry);
    }

    // GET /projects/:id/milestones
    async getMilestones(projectId: number): Promise<ProjectMilestone[]> {
        return this.projectMilestoneRepository.find({
            where: { projectId },
            relations: ['milestone'],
            order: { milestone: { dueDate: 'ASC' } },
        });
    }

    // PATCH /milestones/:id/approve
    async approve(id: number): Promise<ProjectMilestone> {
        const entry = await this.findProjectMilestone(id);
        entry.status = 'approved';
        entry.reviewedAt = new Date();
        return this.projectMilestoneRepository.save(entry);
    }

    // PATCH /milestones/:id/reject
    async reject(id: number, dto: RejectMilestoneDto): Promise<ProjectMilestone> {
        const entry = await this.findProjectMilestone(id);
        entry.status = 'rejected';
        entry.remarks = dto.remarks;
        entry.reviewedAt = new Date();
        return this.projectMilestoneRepository.save(entry);
    }

    // POST /milestones/:id/upload
    async uploadFile(
        id: number,
        file: Express.Multer.File,
        uploadedBy?: number,
    ): Promise<SubmissionFile> {
        await this.findProjectMilestone(id);

        const submission = this.submissionFileRepository.create({
            projectMilestoneId: id,
            fileName: file.originalname,
            filePath: file.path,
            uploadedBy: uploadedBy,
        });

        await this.projectMilestoneRepository.update(id, {
            submittedAt: new Date(),
        });

        return this.submissionFileRepository.save(submission);
    }

    private async findProjectMilestone(id: number): Promise<ProjectMilestone> {
        const entry = await this.projectMilestoneRepository.findOne({ where: { id } });
        if (!entry) throw new NotFoundException(`ProjectMilestone #${id} not found`);
        return entry;
    }
}
