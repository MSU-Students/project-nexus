import { IsNumber } from 'class-validator';

export class AssignPanelDto {
  @IsNumber({}, { message: 'scheduleId must be a number' })
  scheduleId: number;

  @IsNumber({}, { message: 'facultyId must be a number' })
  facultyId: number;
}

export class RemovePanelDto {
  @IsNumber({}, { message: 'scheduleId must be a number' })
  scheduleId: number;

  @IsNumber({}, { message: 'facultyId must be a number' })
  facultyId: number;
}