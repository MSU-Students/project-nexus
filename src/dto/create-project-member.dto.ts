import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectMemberDto {
  @ApiProperty()
  projectId: number;

  @ApiProperty()
  userId: number;

  @ApiPropertyOptional()
  roleInProject?: string;
}
