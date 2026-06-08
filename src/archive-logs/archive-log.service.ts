import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArchiveLog } from 'src/entities/archive-log.entity';
import { CreateArchiveLogDto } from 'src/dto/create-archive-log.dto';

@Injectable()
export class ArchiveLogService {
  constructor(
    @InjectRepository(ArchiveLog)
    private readonly repo: Repository<ArchiveLog>,
  ) {}

  async create(dto: CreateArchiveLogDto): Promise<ArchiveLog> {
    const log = this.repo.create({
      ...dto,
      entityId: dto.entityId !== undefined && dto.entityId !== null ? String(dto.entityId) : undefined,
    });
    return this.repo.save(log);
  }

  async findAll(): Promise<ArchiveLog[]> {
    return this.repo.find({
      relations: ['changedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByEntity(
    entityType: string,
    entityId: string | number,
  ): Promise<ArchiveLog[]> {
    return this.repo.find({
      where: { entityType, entityId: String(entityId) },
      relations: ['changedBy'],
      order: { createdAt: 'DESC' },
    });
  }
}
