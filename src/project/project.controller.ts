import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { MilestoneService } from 'src/milestone/milestone.service';
import { CreateProjectDto } from 'src/dto/create-project.dto';
import { UpdateProjectStageDto } from 'src/dto/update-project-stage.dto';
import { CreateProjectMilestoneDto } from 'src/dto/create-project-milestone.dto';
import { AuditEvent } from 'src/decorators';

@ApiBearerAuth()
@ApiTags('projects')
@Controller('projects')
export class ProjectController {
    constructor(
        private readonly projectService: ProjectService,
        private readonly milestoneService: MilestoneService,
    ) {}

    // POST /projects
    @Post()
    @AuditEvent({ action: 'CREATE_PROJECT', module: 'PROJECT', table: 'projects' })
    create(@Body() dto: CreateProjectDto) {
        return this.projectService.create(dto);
    }

    // GET /projects
    @Get()
    findAll() {
        return this.projectService.findAll();
    }

    // GET /projects/:id
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.projectService.findOne(id);
    }

    // PATCH /projects/:id/stage
    @Patch(':id/stage')
    @AuditEvent({ action: 'UPDATE_PROJECT_STAGE', module: 'PROJECT', table: 'projects' })
    updateStage(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateProjectStageDto,
        @Request() req: any,
    ) {
        const changedBy: number | undefined = req.user?.sub ?? req.user?.id;
        return this.projectService.updateStage(id, dto, changedBy);
    }

    // GET /projects/:id/history
    @Get(':id/history')
    getHistory(@Param('id', ParseIntPipe) id: number) {
        return this.projectService.getHistory(id);
    }

    // POST /projects/:id/milestones
    @Post(':id/milestones')
    @AuditEvent({ action: 'ADD_PROJECT_MILESTONE', module: 'PROJECT', table: 'project_milestones' })
    addMilestone(
        @Param('id', ParseIntPipe) projectId: number,
        @Body() dto: CreateProjectMilestoneDto,
    ) {
        return this.milestoneService.addMilestone(projectId, dto);
    }

    // GET /projects/:id/milestones
    @Get(':id/milestones')
    getMilestones(@Param('id', ParseIntPipe) projectId: number) {
        return this.milestoneService.getMilestones(projectId);
    }
}
