import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators';
import { Role } from 'src/enums';
import { AuditService } from './audit.service';

@ApiBearerAuth()
@ApiTags('audit-logs')
@Controller('audit-logs')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles(Role.COORDINATOR)
  findAll(
    @Query('action') action?: string,
    @Query('username') username?: string,
    @Query('module') module?: string,
  ) {
    return this.auditService.findAll({ action, username, module });
  }
}
