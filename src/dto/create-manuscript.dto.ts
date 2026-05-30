import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateManuscriptDto {
  @ApiProperty()
  projectId: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  fileName: string;

  @ApiProperty()
  originalName: string;

  @ApiProperty()
  filePath: string;

  @ApiPropertyOptional()
  fileSize?: number;

  @ApiPropertyOptional()
  mimeType?: string;

  @ApiPropertyOptional()
  uploadedById?: number;

  @ApiPropertyOptional()
  version?: number;

  @ApiPropertyOptional()
  status?: string;

  @ApiPropertyOptional()
  remarks?: string;
}
