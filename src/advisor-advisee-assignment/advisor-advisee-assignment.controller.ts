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
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdvisorAdviseeAssignmentService } from './advisor-advisee-assignment.service';
import { CreateAssignmentDto } from 'src/dto/create-assignment.dto';
import { Roles } from 'src/decorators';
import { Role } from 'src/enums';
import { RolesGuard } from 'src/guards';

@ApiBearerAuth()
@ApiTags('assignments')
@Controller()
@UseGuards(RolesGuard)
export class AdvisorAdviseeAssignmentController {
    constructor(private readonly assignmentService: AdvisorAdviseeAssignmentService) {}

    @ApiOperation({
        summary: 'Assign adviser to a group (coordinator only)',
        description:
            'Creates an adviser–group assignment. Validates capacity (max 5 groups per adviser) ' +
            'and ensures the group does not already have an adviser. Restricted to coordinators.',
    })
    @Roles(Role.COORDINATOR)
    @Post('assignments')
    create(@Body() dto: CreateAssignmentDto, @Request() req: any) {
        const assignedBy: number | undefined = req.user?.sub ?? req.user?.id;
        return this.assignmentService.create(dto, assignedBy);
    }

    @Get('advisers/:id/groups')
    getGroupsByAdviser(@Param('id', ParseIntPipe) adviserId: number) {
        return this.assignmentService.getGroupsByAdviser(adviserId);
    }

    @Get('groups/:id/adviser')
    getAdviserByGroup(@Param('id', ParseIntPipe) groupId: number) {
        return this.assignmentService.getAdviserByGroup(groupId);
    }

    @ApiOperation({
        summary: 'Remove adviser assignment (coordinator only)',
        description: 'Deletes an adviser–group assignment. Restricted to coordinators.',
    })
    @Roles(Role.COORDINATOR)
    @Delete('assignments/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.assignmentService.remove(id);
    }
}