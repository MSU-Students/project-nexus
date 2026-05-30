import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from 'src/dto/create-assignment.dto';

@ApiBearerAuth()
@ApiTags('assignments')
@Controller()
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  // POST /assignments
  @Post('assignments')
  create(@Body() dto: CreateAssignmentDto, @Request() req: any) {
    const assignedBy: number | undefined = req.user?.sub ?? req.user?.id;
    return this.assignmentService.create(dto, assignedBy);
  }

  // GET /advisers/:id/groups
  @Get('advisers/:id/groups')
  getGroupsByAdviser(@Param('id', ParseIntPipe) adviserId: number) {
    return this.assignmentService.getGroupsByAdviser(adviserId);
  }

  // GET /groups/:id/adviser
  @Get('groups/:id/adviser')
  getAdviserByGroup(@Param('id', ParseIntPipe) groupId: number) {
    return this.assignmentService.getAdviserByGroup(groupId);
  }

  // DELETE /assignments/:id
  @Delete('assignments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentService.remove(id);
  }
}
