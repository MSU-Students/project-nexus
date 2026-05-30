import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectMember } from 'src/entities/project-member.entity';
import { CreateProjectMemberDto } from 'src/dto/create-project-member.dto';

@Injectable()
export class ProjectMemberService {
  constructor(
    @InjectRepository(ProjectMember)
    private readonly repo: Repository<ProjectMember>,
  ) {}

  async create(dto: CreateProjectMemberDto): Promise<ProjectMember> {
    const member = this.repo.create(dto);
    return this.repo.save(member);
  }

  async findByProject(projectId: number): Promise<ProjectMember[]> {
    return this.repo.find({
      where: { projectId },
      relations: ['user'],
    });
  }

  async findByUser(userId: number): Promise<ProjectMember[]> {
    return this.repo.find({
      where: { userId },
      relations: ['project'],
    });
  }

  async remove(id: string): Promise<void> {
    const member = await this.repo.findOne({ where: { id } });
    if (!member) throw new NotFoundException(`ProjectMember #${id} not found`);
    await this.repo.remove(member);
  }
}
