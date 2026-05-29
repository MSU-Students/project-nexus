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
import { ProjectMemberService } from './project-member.service';
import { CreateProjectMemberDto } from 'src/dto/create-project-member.dto';

@ApiBearerAuth()
@ApiTags('project-members')
@Controller('project-members')
export class ProjectMemberController {
    constructor(private readonly service: ProjectMemberService) {}

    @Post()
    create(@Body() dto: CreateProjectMemberDto) {
        return this.service.create(dto);
    }

    @Get('project/:projectId')
    findByProject(@Param('projectId', ParseIntPipe) projectId: number) {
        return this.service.findByProject(projectId);
    }

    @Get('user/:userId')
    findByUser(@Param('userId', ParseIntPipe) userId: number) {
        return this.service.findByUser(userId);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}
