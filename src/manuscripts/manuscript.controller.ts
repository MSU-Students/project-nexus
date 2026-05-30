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
import { ManuscriptService } from './manuscript.service';
import { CreateManuscriptDto } from 'src/dto/create-manuscript.dto';

@ApiBearerAuth()
@ApiTags('manuscripts')
@Controller('manuscripts')
export class ManuscriptController {
  constructor(private readonly service: ManuscriptService) {}

  @Post()
  create(@Body() dto: CreateManuscriptDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.service.findByProject(projectId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
