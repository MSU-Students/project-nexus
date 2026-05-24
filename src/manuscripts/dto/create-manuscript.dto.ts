import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateManuscriptDto {
  @IsString()
  projectId: string;

  @IsString()
  fileName: string;

  @IsString()
  originalName: string;

  @IsString()
  filePath: string;

  @IsNumber()
  fileSize: number;

  @IsString()
  mimeType: string;

  @IsOptional()
  @IsNumber()
  version?: number;
}
