import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthenticatedUser } from './archive.controller';
import { SearchProjectDto } from './search-project.dto';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ProjectStatus = 'Draft' | 'In-Progress' | 'Completed' | 'Archived';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  abstract: string;

  @Column()
  year: number;

  @Column()
  adviser: string;

  @Column('text', { array: true, default: '{}' })
  techStack: string[];

  @Column({ default: 'Draft' })
  status: ProjectStatus;

  @Column({ nullable: true })
  groupId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('project_versions')
export class ProjectVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  project: Project;

  @Column()
  projectId: string;

  @Column()
  fileUrl: string;

  @Column({ default: 1 })
  versionNumber: number;

  @Column({ nullable: true })
  changeNotes: string;

  @CreateDateColumn()
  createdAt: Date;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class ArchiveService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(ProjectVersion)
    private readonly versionRepo: Repository<ProjectVersion>,
  ) {}

  async search(
    dto: SearchProjectDto,
    user: AuthenticatedUser,
  ): Promise<PaginatedResult<Project>> {
    const { keyword, year, adviser, techStack, page, limit } = dto;

    const qb = this.projectRepo
      .createQueryBuilder('project')
      .loadRelationCountAndMap(
        'project.versionCount',
        'project.versions',
      );

    if (user.role === 'Student') {
      qb.where('project.status = :status', { status: 'Archived' });
    }

    if (keyword) {
      qb.andWhere(
        '(project.title ILIKE :keyword OR project.abstract ILIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (year !== undefined) {
      qb.andWhere('project.year = :year', { year });
    }

    if (adviser) {
      qb.andWhere('project.adviser ILIKE :adviser', {
        adviser: `%${adviser}%`,
      });
    }

    if (techStack && techStack.length > 0) {
      
      qb.andWhere('project.techStack && ARRAY[:...techStack]', { techStack });
    }

    const offset = (page - 1) * limit;
    qb.skip(offset).take(limit);

    qb.orderBy('project.year', 'DESC').addOrderBy('project.createdAt', 'DESC');

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, user: AuthenticatedUser): Promise<Project> {
    const qb = this.projectRepo
      .createQueryBuilder('project')
      .where('project.id = :id', { id });

    if (user.role === 'Student') {
      qb.andWhere('project.status = :status', { status: 'Archived' });
    }

    const project = await qb.getOne();

    if (!project) {
      throw new NotFoundException(`Project with id "${id}" was not found.`);
    }

    return project;
  }

  async getVersions(
    projectId: string,
    user: AuthenticatedUser,
  ): Promise<ProjectVersion[]> {

    const project = await this.findOne(projectId, user);
   
    if (user.role === 'Student') {
      if (!user.groupId) {
        throw new ForbiddenException(
          'Your account is not associated with any group.',
        );
      }

      if (project.groupId !== user.groupId) {
        throw new ForbiddenException(
          'You do not have permission to access the version history of this project.',
        );
      }
    }
    const versions = await this.versionRepo
      .createQueryBuilder('version')
      .where('version.projectId = :projectId', { projectId })
      .orderBy('version.versionNumber', 'DESC')
      .addOrderBy('version.createdAt', 'DESC')
      .getMany();

    return versions;
  }
}