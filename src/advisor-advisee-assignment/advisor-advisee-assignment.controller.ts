import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
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
     })

    @Roles(Role.COORDINATOR)
    @Post('assignments')
    create(@Body() dto: CreateAssignmentDto, @Request() req: any) {
        const assignedBy: number | undefined = req.user?.sub ?? req.user?.id;
        return this.assignmentService.create(dto, assignedBy);
    }

    @ApiOperation({
        summary: 'Get groups assigned to an adviser',
        description:
            'Coordinators can query any adviser. ' +
            'Advisers (faculty role) can only query their own adviser record.',
    })
    @Get('advisers/:id/groups')
    async getGroupsByAdviser(
        @Param('id', ParseIntPipe) adviserId: number,
        @Request() req: any,
    ) {
        const user = req.user;
        const isFaculty = user?.roles?.includes(Role.FACULTY) || user?.role === Role.FACULTY;
 
        if (isFaculty) {
            // Row-Level Security: adviser can only see their own groups.
            const requestingUserId: number = user.sub ?? user.id;
            const ownAdviserId = await this.assignmentService.getAdviserIdByUserId(requestingUserId);
 
            if (ownAdviserId !== adviserId) {
                throw new ForbiddenException('You can only view your own assigned groups.');
            }
        }
 
        return this.assignmentService.getGroupsByAdviser(adviserId);
    }
 
    // GET /groups/:id/adviser
    // APEX-AA-004: Advisers can only see this result if they are the assigned adviser.
    @ApiOperation({
        summary: 'Get adviser assigned to a group',
        description:
            'Coordinators see any result. ' +
            'Advisers (faculty role) can only view groups they are assigned to.',
    })
    @Get('groups/:id/adviser')
    async getAdviserByGroup(
        @Param('id', ParseIntPipe) groupId: number,
        @Request() req: any,
    ) {
        const user = req.user;
        const assignment = await this.assignmentService.getAdviserByGroup(groupId);
 
        const isFaculty = user?.roles?.includes(Role.FACULTY) || user?.role === Role.FACULTY;
 
        if (isFaculty) {
            // Row-Level Security: adviser can only view groups they're assigned to.
            const requestingUserId: number = user.sub ?? user.id;
            const ownAdviserId = await this.assignmentService.getAdviserIdByUserId(requestingUserId);
 
            if (assignment.adviserId !== ownAdviserId) {
                throw new ForbiddenException('You are not the assigned adviser for this group.');
            }
        }
 
        return assignment;
    }
 
    // DELETE /assignments/:id — coordinator only
    @ApiOperation({
        summary: 'Remove adviser assignment (coordinator only)',
    })
    @Roles(Role.COORDINATOR)
    @Delete('assignments/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.assignmentService.remove(id);
    }
}
 