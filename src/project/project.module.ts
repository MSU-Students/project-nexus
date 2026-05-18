import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person, Project } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Person])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
