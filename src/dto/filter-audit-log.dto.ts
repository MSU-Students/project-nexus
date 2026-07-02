import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { AuditAction } from 'src/enums';

export class FilterAuditLogDto {
  /** Filter by entity type (e.g. 'Manuscript', 'DefenseSchedule') */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  entityType?: string;

  /** Filter by a specific entity's ID */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  entityId?: string;

  /** Filter by action performed (e.g. 'LOGIN', 'CREATE_MANUSCRIPT') */
  @ApiPropertyOptional({ enum: AuditAction })
  @IsOptional()
  @IsString()
  action?: string;

  /** Filter by user role (e.g. 'admin', 'student') */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userRole?: string;

  /** Filter by the ID of the user who performed the action */
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  changedById?: number;

  /** Start of date range (ISO 8601, e.g. '2025-01-01') */
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  from?: string;

  /** End of date range (ISO 8601, e.g. '2025-12-31') */
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  to?: string;

  /** Page number (1-indexed, default: 1) */
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  /** Number of results per page (default: 20, max: 100) */
  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
