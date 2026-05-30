import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PanelAssignment } from 'src/entities/panel-assignment.entity';
import { User } from 'src/entities/user.entity';
import { PanelAssignmentController } from './panel-assignment.controller';
import { PanelAssignmentService } from './panel-assignment.service';
import { DefenseSchedule } from 'src/entities/defense-schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PanelAssignment, User, DefenseSchedule])],
  controllers: [PanelAssignmentController],
  providers: [PanelAssignmentService],
  exports: [PanelAssignmentService],
})
export class PanelAssignmentModule {}
