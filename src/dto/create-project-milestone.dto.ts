import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectMilestoneDto {
    @ApiProperty()
    milestoneId: number;
}
