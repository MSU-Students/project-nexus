import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  abstract?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  stageId?: number;

  @ApiPropertyOptional()
  groupId?: number;

  @ApiPropertyOptional()
  adviserId?: number;

  @ApiPropertyOptional()
  year?: string;

  @ApiPropertyOptional()
  techStack?: string;
}
