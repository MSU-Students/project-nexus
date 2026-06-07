import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async logAction(logData: Partial<AuditLog>): Promise<AuditLog> {
    const log = this.auditLogRepository.create(logData);
    return this.auditLogRepository.save(log);
  }

  async findAll(filters?: { action?: string; username?: string; module?: string }): Promise<AuditLog[]> {
    const where: any = {};
    if (filters?.action) {
      where.action = filters.action;
    }
    if (filters?.username) {
      where.username = filters.username;
    }
    if (filters?.module) {
      where.affectedModule = filters.module;
    }
    return this.auditLogRepository.find({
      where,
      order: { timestamp: 'DESC' },
    });
  }
}
