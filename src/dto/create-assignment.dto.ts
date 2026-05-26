import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignmentDto {
    @ApiProperty()
    adviserId: number;

    @ApiProperty()
    groupId: number;

    @ApiProperty()
    assignedBy?: number;
}
