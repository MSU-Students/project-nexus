import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArchiveLogDto {
  @ApiProperty()
  entityType: string;

  @ApiProperty()
  entityId: string | number;

  @ApiProperty()
  action: string;

  @ApiPropertyOptional()
  userRole?: string;

  @ApiPropertyOptional()
  ipAddress?: string;

  @ApiPropertyOptional()
  deviceInfo?: string;

  @ApiPropertyOptional()
  changedById?: number;

  @ApiPropertyOptional()
  oldValues?: Record<string, any>;

  @ApiPropertyOptional()
  newValues?: Record<string, any>;
}
