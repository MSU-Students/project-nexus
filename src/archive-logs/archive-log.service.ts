import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { ArchiveLog } from 'src/entities/archive-log.entity';
import { CreateArchiveLogDto } from 'src/dto/create-archive-log.dto';
import { FilterAuditLogDto } from 'src/dto/filter-audit-log.dto';
import { PaginatedAuditLogResponseDto } from 'src/dto/audit-log-response.dto';

@Injectable()
export class ArchiveLogService {
  constructor(
    @InjectRepository(ArchiveLog)
    private readonly repo: Repository<ArchiveLog>,
  ) {}

  /** Persist a new audit log entry. Called by the global AuditLogInterceptor and other services. */
  async create(dto: CreateArchiveLogDto): Promise<ArchiveLog> {
    const log = this.repo.create({
      ...dto,
      entityId: dto.entityId !== undefined && dto.entityId !== null ? String(dto.entityId) : undefined,
    });
    return this.repo.save(log);
  }

  /**
   * Retrieve all audit logs with optional filtering and pagination.
   * Supports filtering by entityType, entityId, action, userRole, changedById, and date range.
   */
  async findAllFiltered(query: FilterAuditLogDto): Promise<PaginatedAuditLogResponseDto> {
    const {
      entityType,
      entityId,
      action,
      userRole,
      changedById,
      from,
      to,
      page = 1,
      limit = 20,
    } = query;

    const where: FindOptionsWhere<ArchiveLog> = {};

    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (action) where.action = action;
    if (userRole) where.userRole = userRole;
    if (changedById) where.changedById = changedById;
    if (from && to) {
      where.createdAt = Between(new Date(from), new Date(to));
    } else if (from) {
      where.createdAt = Between(new Date(from), new Date());
    }

    const [data, total] = await this.repo.findAndCount({
      where,
      relations: ['changedBy'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  /** Retrieve a single audit log entry by its ID. Throws NotFoundException if not found. */
  async findOne(id: number): Promise<ArchiveLog> {
    const log = await this.repo.findOne({
      where: { id },
      relations: ['changedBy'],
    });
    if (!log) throw new NotFoundException(`Audit log #${id} not found`);
    return log;
  }

  /** Retrieve all audit logs for a specific entity (e.g. all logs for a given manuscript). */
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
