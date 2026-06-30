import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Slim user shape embedded inside each audit log response */
export class AuditLogUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;
}

/** Response shape for a single audit log entry returned to the admin dashboard */
export class AuditLogResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  entityType: string;

  @ApiPropertyOptional()
  entityId?: string;

  @ApiProperty()
  action: string;

  @ApiPropertyOptional()
  userRole?: string;

  @ApiPropertyOptional()
  ipAddress?: string;

  @ApiPropertyOptional()
  deviceInfo?: string;

  @ApiPropertyOptional({ type: () => AuditLogUserDto })
  changedBy?: AuditLogUserDto;

  @ApiPropertyOptional()
  oldValues?: Record<string, any>;

  @ApiPropertyOptional()
  newValues?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;
}

/** Paginated wrapper for audit log list responses */
export class PaginatedAuditLogResponseDto {
  @ApiProperty({ type: [AuditLogResponseDto] })
  data: AuditLogResponseDto[];

  @ApiProperty({ description: 'Total number of matching records' })
  total: number;

  @ApiProperty({ description: 'Current page number (1-indexed)' })
  page: number;

  @ApiProperty({ description: 'Total number of pages' })
  lastPage: number;
}
