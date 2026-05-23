import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { AssignmentModule } from './assignment/assignment.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards';
import { AuthGuard } from './auth/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  User,
  Stage,
  Project,
  ProjectStageHistory,
  Adviser,
  Group,
  AdviserAssignment,
  Milestone,
  ProjectMilestone,
  SubmissionFile,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'rootpass',
      database: 'project-nexus-db',
      entities: [
        User,
        Stage,
        Project,
        ProjectStageHistory,
        Adviser,
        Group,
        AdviserAssignment,
        Milestone,
        ProjectMilestone,
        SubmissionFile,
      ],
      synchronize: true
    }),
    UserModule,
    AuthModule,
    ProjectModule,
    AssignmentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard

    }
  ]
})
export class AppModule { }
