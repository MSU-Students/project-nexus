import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectStageDto {
    @ApiProperty()
    stageId: number;
}
