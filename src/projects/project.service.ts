import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Role } from '../common';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(dto: CreateProjectDto, userId: string): Promise<Project> {
    const project = this.projectRepository.create({
      ...dto,
      createdById: userId,
    });
    return this.projectRepository.save(project);
  }

  async findAll(userId: string, userRole: string): Promise<Project[]> {
    if (userRole === Role.Admin) {
      return this.projectRepository.find({ relations: ['adviser', 'createdBy'] });
    }
    if (userRole === Role.Adviser) {
      return this.projectRepository.find({
        where: { adviserId: userId },
        relations: ['adviser', 'createdBy'],
      });
    }
    return this.projectRepository.find({
      where: { createdById: userId },
      relations: ['adviser', 'createdBy'],
    });
  }

  async findById(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['adviser', 'createdBy'],
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async search(query: string): Promise<Project[]> {
    return this.projectRepository.find({
      where: [
        { title: ILike(`%${query}%`) },
        { abstract: ILike(`%${query}%`) },
      ],
      relations: ['adviser', 'createdBy'],
    });
  }

  async update(
    id: string,
    dto: UpdateProjectDto,
    userId: string,
    userRole: string,
  ): Promise<Project> {
    const project = await this.findById(id);

    if (project.createdById !== userId && userRole !== Role.Admin) {
      throw new ForbiddenException('Not allowed to update this project');
    }

    Object.assign(project, dto);
    return this.projectRepository.save(project);
  }

  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const project = await this.findById(id);

    if (project.createdById !== userId && userRole !== Role.Admin) {
      throw new ForbiddenException('Not allowed to delete this project');
    }

    await this.projectRepository.remove(project);
  }
}
