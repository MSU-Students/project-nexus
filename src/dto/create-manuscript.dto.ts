import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateManuscriptDto {
  @ApiProperty()
  projectId: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  filePath: string;

  @ApiPropertyOptional()
  status?: string;

  @ApiPropertyOptional()
  remarks?: string;
}
