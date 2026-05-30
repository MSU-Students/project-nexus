import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArchiveLogDto {
  @ApiProperty()
  entityType: string;

  @ApiProperty()
  entityId: number;

  @ApiProperty()
  action: string;

  @ApiPropertyOptional()
  changedById?: number;

  @ApiPropertyOptional()
  oldValues?: Record<string, any>;

  @ApiPropertyOptional()
  newValues?: Record<string, any>;
}
