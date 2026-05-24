import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectMember } from './project-member.entity';
import { AddMemberDto } from './dto/add-member.dto';

@Injectable()
export class ProjectMemberService {
  constructor(
    @InjectRepository(ProjectMember)
    private readonly memberRepository: Repository<ProjectMember>,
  ) {}

  async add(
    projectId: string,
    dto: AddMemberDto,
  ): Promise<ProjectMember> {
    const existing = await this.memberRepository.findOne({
      where: { projectId, userId: dto.userId },
    });
    if (existing) {
      throw new ConflictException('User is already a member of this project');
    }

    const member = this.memberRepository.create({
      projectId,
      userId: dto.userId,
      roleInProject: dto.roleInProject,
    });
    return this.memberRepository.save(member);
  }

  async findByProject(projectId: string): Promise<ProjectMember[]> {
    return this.memberRepository.find({
      where: { projectId },
      relations: ['user'],
    });
  }

  async findByUser(userId: string): Promise<ProjectMember[]> {
    return this.memberRepository.find({
      where: { userId },
      relations: ['project'],
    });
  }

  async remove(projectId: string, userId: string): Promise<void> {
    const member = await this.memberRepository.findOne({
      where: { projectId, userId },
    });
    if (!member) {
      throw new NotFoundException('Membership not found');
    }
    await this.memberRepository.remove(member);
  }
}
