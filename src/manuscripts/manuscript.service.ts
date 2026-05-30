import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manuscript } from 'src/entities/manuscript.entity';
import { CreateManuscriptDto } from 'src/dto/create-manuscript.dto';

@Injectable()
export class ManuscriptService {
  constructor(
    @InjectRepository(Manuscript)
    private readonly repo: Repository<Manuscript>,
  ) {}

  async create(dto: CreateManuscriptDto): Promise<Manuscript> {
    const manuscript = this.repo.create(dto);
    return this.repo.save(manuscript);
  }

  async uploadFile(
    file: Express.Multer.File,
    projectId: number,
    uploadedById: number,
    title?: string,
  ): Promise<Manuscript> {
    const latest = await this.repo.findOne({
      where: { projectId },
      order: { version: 'DESC' },
    });
    const nextVersion = latest ? latest.version + 1 : 1;

    const manuscript = this.repo.create({
      projectId,
      title: title ?? file.originalname,
      fileName: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedById,
      version: nextVersion,
    });
    return this.repo.save(manuscript);
  }

  async findAll(): Promise<Manuscript[]> {
    return this.repo.find({
      relations: ['project'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Manuscript> {
    const manuscript = await this.repo.findOne({
      where: { id },
      relations: ['project'],
    });
    if (!manuscript) throw new NotFoundException(`Manuscript #${id} not found`);
    return manuscript;
  }

  async findByProject(projectId: number): Promise<Manuscript[]> {
    return this.repo.find({
      where: { projectId },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: string): Promise<void> {
    const manuscript = await this.findOne(id);
    await this.repo.remove(manuscript);
  }
}
