import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ArchiveService } from './archive.service';
import { SearchProjectDto } from './search-project.dto';

export interface AuthenticatedUser {
  id: string;
  role: 'Student' | 'Adviser' | 'Admin';
  groupId?: string;
}

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
class JwtAuthGuard implements CanActivate {
  canActivate(_ctx: ExecutionContext): boolean {
    
    return true;
  }
}

@UseGuards(JwtAuthGuard)
@Controller('api/v1/archive')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @Get('search')
  async search(
    @Query() searchDto: SearchProjectDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.archiveService.search(searchDto, req.user);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.archiveService.findOne(id, req.user);
  }

  @Get(':id/versions')
  async getVersions(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.archiveService.getVersions(id, req.user);
  }
}