import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMember } from 'src/entities/project-member.entity';
import { ProjectMemberController } from './project-member.controller';
import { ProjectMemberService } from './project-member.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectMember])],
    controllers: [ProjectMemberController],
    providers: [ProjectMemberService],
    exports: [ProjectMemberService],
})
export class ProjectMemberModule {}
