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
import { Roles } from 'src/decorators';
import { Role } from 'src/enums';
import { DefenseScheduleService } from './defense-schedule.service';
import {
  CreateDefenseScheduleDto,
  FilterDefenseScheduleDto,
  UpdateDefenseScheduleDto,
} from 'src/dto';

@Controller('defense-schedules')
export class DefenseScheduleController {
  constructor(private readonly scheduleService: DefenseScheduleService) {}

  // Only COORDINATOR can create
  @Post()
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDefenseScheduleDto,
  ) {
    return this.scheduleService.update(id, dto);
  }

  // Only COORDINATOR can delete
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.scheduleService.remove(id);
  }
}
