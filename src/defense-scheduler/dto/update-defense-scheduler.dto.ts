import { PartialType } from '@nestjs/swagger';
import { CreateDefenseSchedulerDto } from './create-defense-scheduler.dto';

export class UpdateDefenseSchedulerDto extends PartialType(CreateDefenseSchedulerDto) {}
