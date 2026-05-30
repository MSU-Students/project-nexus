import { ApiProperty } from '@nestjs/swagger';

export class RejectMilestoneDto {
  @ApiProperty()
  remarks: string;
}
