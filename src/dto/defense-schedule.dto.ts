import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { DefenseType, ScheduleStatus } from 'src/entities/defense-schedule.entity';

// TIME FORMAT: HH:MM (24-hour)
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class CreateDefenseScheduleDto {
  @IsEnum(DefenseType, { message: 'defenseType must be TITLE_DEFENSE, PROPOSAL, or FINAL_DEFENSE' })
  defenseType: DefenseType;

  @IsNotEmpty({ message: 'date is required' })
  @IsString()
  date: string; // format: YYYY-MM-DD

  @IsNotEmpty({ message: 'startTime is required' })
  @Matches(TIME_REGEX, { message: 'startTime must be in HH:MM format' })
  startTime: string;

  @IsNotEmpty({ message: 'endTime is required' })
  @Matches(TIME_REGEX, { message: 'endTime must be in HH:MM format' })
  endTime: string;

  @IsNotEmpty({ message: 'room is required' })
  @IsString()
  room: string;
}

export class UpdateDefenseScheduleDto {
  @IsEnum(DefenseType, { message: 'defenseType must be TITLE_DEFENSE, PROPOSAL, or FINAL_DEFENSE' })
  defenseType?: DefenseType;

  @IsString()
  date?: string;

  @Matches(TIME_REGEX, { message: 'startTime must be in HH:MM format' })
  startTime?: string;

  @Matches(TIME_REGEX, { message: 'endTime must be in HH:MM format' })
  endTime?: string;

  @IsString()
  room?: string;

  @IsEnum(ScheduleStatus, { message: 'status must be SCHEDULED, ONGOING, COMPLETED, or CANCELLED' })
  status?: ScheduleStatus;
}

export class FilterDefenseScheduleDto {
  defenseType?: DefenseType;
  status?: ScheduleStatus;
  date?: string;
}