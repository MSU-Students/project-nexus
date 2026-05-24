import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ManuscriptService } from './manuscript.service';
import { CreateManuscriptDto } from './dto/create-manuscript.dto';
import { CurrentUser, Roles } from '../common';
import { Role } from '../common';

@Controller('manuscripts')
export class ManuscriptController {
  constructor(private readonly manuscriptService: ManuscriptService) {}

  @Post()
  create(@Body() dto: CreateManuscriptDto, @CurrentUser() user: any) {
    return this.manuscriptService.create(dto, user.sub);
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.manuscriptService.findByProject(projectId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.manuscriptService.findById(id);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.manuscriptService.remove(id);
  }
}
