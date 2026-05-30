import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/decorators';
import { Role } from 'src/enums';
import { PanelAssignmentService } from './panel-assignment.service';
import { AssignPanelDto, RemovePanelDto } from 'src/dto';

@ApiBearerAuth()
@Controller('panel-assignments')
export class PanelAssignmentController {
  constructor(private readonly panelService: PanelAssignmentService) {}

  @Post()
  @Roles(Role.ADMIN)
  assign(@Body() dto: AssignPanelDto) {
    return this.panelService.assign(dto);
  }

  @Delete()
  @Roles(Role.ADMIN)
  remove(@Body() dto: RemovePanelDto) {
    return this.panelService.remove(dto);
  }

  @Get('schedule/:scheduleId')
  findBySchedule(@Param('scheduleId', ParseIntPipe) scheduleId: number) {
    return this.panelService.findBySchedule(scheduleId);
  }
}
