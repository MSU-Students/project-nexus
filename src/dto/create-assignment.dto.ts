import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAssignmentDto {
    @ApiProperty()
    adviserId: number;

    @ApiProperty()
    groupId: number;

    @ApiPropertyOptional()
    assignedBy?: number;
}
