import { IsString, IsOptional } from 'class-validator';

export class CreateLogDto {
  @IsString()
  action: string;

  @IsString()
  targetType: string;

  @IsOptional()
  @IsString()
  targetId?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
