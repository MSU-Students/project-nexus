import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ProjectMemberService } from './project-member.service';
import { AddMemberDto } from './dto/add-member.dto';
import { Roles } from '../common';
import { Role } from '../common';

@Controller('project-members')
export class ProjectMemberController {
  constructor(
    private readonly memberService: ProjectMemberService,
  ) {}

  @Roles(Role.Admin, Role.Adviser)
  @Post(':projectId')
  addMember(
    @Param('projectId') projectId: string,
    @Body() dto: AddMemberDto,
  ) {
    return this.memberService.add(projectId, dto);
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.memberService.findByProject(projectId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.memberService.findByUser(userId);
  }

  @Roles(Role.Admin, Role.Adviser)
  @Delete(':projectId/user/:userId')
  removeMember(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    return this.memberService.remove(projectId, userId);
  }
}
