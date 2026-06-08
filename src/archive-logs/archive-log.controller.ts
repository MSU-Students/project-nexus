import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ArchiveLogService } from './archive-log.service';
import { CreateArchiveLogDto } from 'src/dto/create-archive-log.dto';

@ApiBearerAuth()
@ApiTags('archive-logs')
@Controller('archive-logs')
export class ArchiveLogController {
  constructor(private readonly service: ArchiveLogService) {}

  @Post()
  create(@Body() dto: CreateArchiveLogDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('entity')
  findByEntity(
    @Query('entityType') entityType: string,
    @Query('entityId') entityId: string,
  ) {
    return this.service.findByEntity(entityType, entityId);
  }
}
