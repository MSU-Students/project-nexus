import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMilestone } from 'src/entities/project-milestone.entity';
import { SubmissionFile } from 'src/entities/submission-file.entity';
import { MilestoneController } from './milestone.controller';
import { MilestoneService } from './milestone.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectMilestone, SubmissionFile])],
    controllers: [MilestoneController],
    providers: [MilestoneService],
})
export class MilestoneModule {}
