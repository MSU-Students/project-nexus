import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ArchiveLogService } from './archive-log.service';
import { CreateArchiveLogDto } from 'src/dto/create-archive-log.dto';
import { FilterAuditLogDto } from 'src/dto/filter-audit-log.dto';
import {
  AuditLogResponseDto,
  PaginatedAuditLogResponseDto,
} from 'src/dto/audit-log-response.dto';
import { Roles } from 'src/decorators';
import { Role } from 'src/enums';

@ApiBearerAuth()
@ApiTags('archive-logs')
@Roles(Role.ADMIN)
@Controller('archive-logs')
export class ArchiveLogController {
  constructor(private readonly service: ArchiveLogService) {}

  /**
   * Manually create an audit log entry.
   * Typically used only for internal/administrative purposes;
   * automatic logging is handled by the global AuditLogInterceptor.
   */
  @Post()
  @ApiOperation({ summary: 'Manually create an audit log entry (Admin only)' })
  create(@Body() dto: CreateArchiveLogDto): Promise<AuditLogResponseDto> {
    return this.service.create(dto);
  }

  /**
   * Retrieve all audit logs with optional filtering and pagination.
   * Supports filtering by entityType, entityId, action, userRole, changedById, from, to.
   */
  @Get()
  @ApiOperation({
    summary: 'List all audit logs with optional filters and pagination (Admin only)',
  })
  @ApiResponse({ type: PaginatedAuditLogResponseDto })
  findAll(@Query() query: FilterAuditLogDto): Promise<PaginatedAuditLogResponseDto> {
    return this.service.findAllFiltered(query);
  }

  /**
   * Retrieve all audit logs for a specific entity type and ID.
   * Useful for viewing the full history of a single manuscript, defense schedule, etc.
   */
  @Get('entity')
  @ApiOperation({
    summary: 'Get all audit logs for a specific entity (Admin only)',
  })
  @ApiResponse({ type: [AuditLogResponseDto] })
  findByEntity(
    @Query('entityType') entityType: string,
    @Query('entityId') entityId: string,
  ): Promise<AuditLogResponseDto[]> {
    return this.service.findByEntity(entityType, entityId);
  }

  /**
   * Retrieve a single audit log entry by its numeric ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a single audit log entry by ID (Admin only)' })
  @ApiResponse({ type: AuditLogResponseDto })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<AuditLogResponseDto> {
    return this.service.findOne(id);
  }
}
