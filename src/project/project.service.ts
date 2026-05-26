import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/entities/project.entity';
import { ProjectStageHistory } from 'src/entities/project-stage-history.entity';
import { CreateProjectDto } from 'src/dto/create-project.dto';
import { UpdateProjectStageDto } from 'src/dto/update-project-stage.dto';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,

        @InjectRepository(ProjectStageHistory)
        private readonly historyRepository: Repository<ProjectStageHistory>,
    ) {}

    // POST /projects
    async create(dto: CreateProjectDto): Promise<Project> {
        const project = this.projectRepository.create(dto);
        return this.projectRepository.save(project);
    }

    // GET /projects
    async findAll(): Promise<Project[]> {
        return this.projectRepository.find({
            relations: ['stage'],
            order: { createdAt: 'DESC' },
        });
    }

    // GET /projects/:id
    async findOne(id: number): Promise<Project> {
        const project = await this.projectRepository.findOne({
            where: { id },
            relations: ['stage'],
        });
        if (!project) throw new NotFoundException(`Project #${id} not found`);
        return project;
    }

    // PATCH /projects/:id/stage

    async updateStage(
        id: number,
        dto: UpdateProjectStageDto,
        changedBy?: number,
    ): Promise<Project> {
        const project = await this.findOne(id);

        const historyEntry = this.historyRepository.create({
            projectId: project.id,
            oldStageId: project.stageId, 
            newStageId: dto.stageId,    
            changedBy: changedBy,
        });
        await this.historyRepository.save(historyEntry);
        
        project.stageId = dto.stageId;
        return this.projectRepository.save(project);
    }

   /* async updateStage(
        id: number,
        dto: UpdateProjectStageDto,
        changedBy?: number,
    ): Promise<Project> {
        const project = await this.findOne(id);

        const historyEntry = this.historyRepository.create({
            projectId: project.id,
            oldStageId: dto.oldStageId,
            newStageId: dto.newStageId,
            changedBy: changedBy,
        });
        await this.historyRepository.save(historyEntry);

        project.stageId = dto.stageId;
        return this.projectRepository.save(project);
    }

    // GET /projects/:id/history
    async getHistory(id: number): Promise<ProjectStageHistory[]> {
        await this.findOne(id);

        return this.historyRepository.find({
            where: { projectId: id },
            relations: ['oldStage', 'newStage', 'changedByUser'],
            order: { changedAt: 'DESC' },
        });
    }*/
}
