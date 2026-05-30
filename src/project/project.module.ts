import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { ProjectStageHistory } from 'src/entities/project-stage-history.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { MilestoneModule } from 'src/milestone/milestone.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectStageHistory]),
    forwardRef(() => MilestoneModule),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
