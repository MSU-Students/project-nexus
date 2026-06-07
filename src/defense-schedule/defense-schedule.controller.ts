import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles, AuditEvent } from 'src/decorators';
import { Role } from 'src/enums';
import { DefenseScheduleService } from './defense-schedule.service';
import {
  CreateDefenseScheduleDto,
  FilterDefenseScheduleDto,
  UpdateDefenseScheduleDto,
} from 'src/dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('defense-schedules')
@Controller('defense-schedules')
export class DefenseScheduleController {
  constructor(private readonly scheduleService: DefenseScheduleService) { }

  // Only COORDINATOR can create
  @Post()
  @Roles(Role.COORDINATOR)
  @AuditEvent({ action: 'CREATE_DEFENSE_SCHEDULE', module: 'DEFENSE_SCHEDULE', table: 'defense_schedules' })
  create(@Body() dto: CreateDefenseScheduleDto) {
    return this.scheduleService.create(dto);
  }

  // All authenticated roles can view the list (with optional filters)
  @Get()
  findAll(@Query() filter: FilterDefenseScheduleDto) {
    return this.scheduleService.findAll(filter);
  }

  // All authenticated roles can view a single schedule
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.scheduleService.findOne(id);
  }

  // Only COORDINATOR can update
  @Patch(':id')
  @Roles(Role.COORDINATOR)
  @AuditEvent({ action: 'UPDATE_DEFENSE_SCHEDULE', module: 'DEFENSE_SCHEDULE', table: 'defense_schedules' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDefenseScheduleDto,
  ) {
    return this.scheduleService.update(id, dto);
  }

  // Only COORDINATOR can delete
  @Delete(':id')
  @Roles(Role.COORDINATOR)
  @AuditEvent({ action: 'DELETE_DEFENSE_SCHEDULE', module: 'DEFENSE_SCHEDULE', table: 'defense_schedules' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.scheduleService.remove(id);
  }
}