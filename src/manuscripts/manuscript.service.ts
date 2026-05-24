import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manuscript } from './manuscript.entity';
import { CreateManuscriptDto } from './dto/create-manuscript.dto';

@Injectable()
export class ManuscriptService {
  constructor(
    @InjectRepository(Manuscript)
    private readonly manuscriptRepository: Repository<Manuscript>,
  ) {}

  async create(dto: CreateManuscriptDto, userId: string): Promise<Manuscript> {
    const latestVersion = await this.manuscriptRepository.findOne({
      where: { projectId: dto.projectId },
      order: { version: 'DESC' },
    });

    const manuscript = this.manuscriptRepository.create({
      ...dto,
      version: (latestVersion?.version ?? 0) + 1,
      uploadedById: userId,
    });

    return this.manuscriptRepository.save(manuscript);
  }

  async findByProject(projectId: string): Promise<Manuscript[]> {
    return this.manuscriptRepository.find({
      where: { projectId },
      order: { version: 'DESC' },
      relations: ['uploadedBy'],
    });
  }

  async findById(id: string): Promise<Manuscript> {
    const manuscript = await this.manuscriptRepository.findOne({
      where: { id },
      relations: ['project', 'uploadedBy'],
    });
    if (!manuscript) {
      throw new NotFoundException('Manuscript not found');
    }
    return manuscript;
  }

  async remove(id: string): Promise<void> {
    const manuscript = await this.findById(id);
    await this.manuscriptRepository.remove(manuscript);
  }
}
