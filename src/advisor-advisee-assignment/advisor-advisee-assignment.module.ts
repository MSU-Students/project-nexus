import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdviserAssignment } from 'src/entities/adviser-assignment.entity';
import { Adviser } from 'src/entities/adviser.entity';
import { AdvisorAdviseeAssignmentController } from './advisor-advisee-assignment.controller';
import { AdvisorAdviseeAssignmentService } from './advisor-advisee-assignment.service';


@Module({
    imports: [TypeOrmModule.forFeature([AdviserAssignment, Adviser])],
    controllers: [AdvisorAdviseeAssignmentController],
    providers: [AdvisorAdviseeAssignmentService],
})
export class AdvisorAdviseeAssignmentModule {}