import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsOrder } from 'typeorm';
import { ArchiveLog } from './archive-log.entity';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class ArchiveLogService {
  constructor(
    @InjectRepository(ArchiveLog)
    private readonly logRepository: Repository<ArchiveLog>,
  ) {}

  async create(
    dto: CreateLogDto,
    userId?: string,
  ): Promise<ArchiveLog> {
    const log = new ArchiveLog();
    log.action = dto.action;
    log.targetType = dto.targetType;
    log.targetId = dto.targetId;
    log.description = dto.description;
    log.userId = userId;
    return this.logRepository.save(log);
  }

  async findAll(
    page = 1,
    limit = 50,
  ): Promise<{ data: ArchiveLog[]; total: number }> {
    const [data, total] = await this.logRepository.findAndCount({
      relations: ['user'],
      order: { createdAt: 'DESC' as FindOptionsOrder<ArchiveLog>['createdAt'] },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async findByUser(userId: string): Promise<ArchiveLog[]> {
    return this.logRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' as FindOptionsOrder<ArchiveLog>['createdAt'] },
      take: 100,
    });
  }

  async findByTarget(
    targetType: string,
    targetId: string,
  ): Promise<ArchiveLog[]> {
    return this.logRepository.find({
      where: { targetType, targetId },
      relations: ['user'],
      order: { createdAt: 'DESC' as FindOptionsOrder<ArchiveLog>['createdAt'] },
    });
  }
}
