import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMemberController } from './project-member.controller';
import { ProjectMemberService } from './project-member.service';
import { ProjectMember } from './project-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectMember])],
  controllers: [ProjectMemberController],
  providers: [ProjectMemberService],
  exports: [ProjectMemberService],
})
export class ProjectMemberModule {}
