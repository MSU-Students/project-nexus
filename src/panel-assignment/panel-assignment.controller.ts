import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles, AuditEvent } from 'src/decorators';
import { Role } from 'src/enums';
import { PanelAssignmentService } from './panel-assignment.service';
import { AssignPanelDto, RemovePanelDto } from 'src/dto';

@ApiBearerAuth()
@ApiTags('panel-assignments')
@Controller('panel-assignments')
export class PanelAssignmentController {
  constructor(private readonly panelService: PanelAssignmentService) { }

  @Post()
  @Roles(Role.COORDINATOR)
  @AuditEvent({ action: 'ASSIGN_PANEL', module: 'PANEL_ASSIGNMENT', table: 'panel_assignments' })
  assign(@Body() dto: AssignPanelDto) {
    return this.panelService.assign(dto);
  }

  @Delete()
  @Roles(Role.COORDINATOR)
  @AuditEvent({ action: 'REMOVE_PANEL', module: 'PANEL_ASSIGNMENT', table: 'panel_assignments' })
  remove(@Body() dto: RemovePanelDto) {
    return this.panelService.remove(dto);
  }

  @Get('schedule/:scheduleId')
  findBySchedule(@Param('scheduleId', ParseIntPipe) scheduleId: number) {
    return this.panelService.findBySchedule(scheduleId);
  }
}