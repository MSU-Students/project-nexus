import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdviserAssignment } from 'src/entities/adviser-assignment.entity';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdviserAssignment])],
  controllers: [AssignmentController],
  providers: [AssignmentService],
})
export class AssignmentModule {}
