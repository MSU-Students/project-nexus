import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ArchiveLogService } from './archive-log.service';
import { CreateLogDto } from './dto/create-log.dto';
import { CurrentUser, Roles } from '../common';
import { Role } from '../common';

@Controller('logs')
export class ArchiveLogController {
  constructor(private readonly logService: ArchiveLogService) {}

  @Roles(Role.Admin)
  @Post()
  create(@Body() dto: CreateLogDto, @CurrentUser() user: any) {
    return this.logService.create(dto, user?.sub);
  }

  @Roles(Role.Admin)
  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.logService.findAll(page ?? 1, limit ?? 50);
  }

  @Roles(Role.Admin)
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.logService.findByUser(userId);
  }

  @Roles(Role.Admin)
  @Get('target/:targetType/:targetId')
  findByTarget(
    @Param('targetType') targetType: string,
    @Param('targetId') targetId: string,
  ) {
    return this.logService.findByTarget(targetType, targetId);
  }
}
