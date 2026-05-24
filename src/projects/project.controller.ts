import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CurrentUser, Roles } from '../common';
import { Role } from '../common';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() dto: CreateProjectDto, @CurrentUser() user: any) {
    return this.projectService.create(dto, user.sub);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.projectService.findAll(user.sub, user.role);
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.projectService.search(query);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.projectService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() user: any,
  ) {
    return this.projectService.update(id, dto, user.sub, user.role);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.projectService.remove(id, user.sub, user.role);
  }
}
