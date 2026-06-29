import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { AssignmentModule } from './assignment/assignment.module';
import { MilestoneModule } from './milestone/milestone.module';
import { ProjectMemberModule } from './project-members/project-member.module';
import { ManuscriptModule } from './manuscripts/manuscript.module';
import { ArchiveLogModule } from './archive-logs/archive-log.module';
import { DefenseScheduleModule } from './defense-schedule/defense-schedule.module';
import { PanelAssignmentModule } from './panel-assignment/panel-assignment.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from './guards';
import { AuthGuard } from './auth/auth.guard';
import { AuditLogInterceptor } from './archive-logs/audit-log.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DefenseSchedule } from './entities/defense-schedule.entity';
import { PanelAssignment } from './entities/panel-assignment.entity';
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
  ProjectMember,
  Manuscript,
  ArchiveLog,
} from './entities';
import { NotificationModule } from './notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),   // top-level registration
    NotificationModule,
    // Load .env globally so all modules can use ConfigService
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database connection reads values from .env
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', 'rootpass'),
        database: config.get<string>('DB_NAME', 'project-nexus-db'),
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
          DefenseSchedule,
          PanelAssignment,
          ProjectMember,
          Manuscript,
          ArchiveLog,
        ],
        synchronize: true,
      }),
    }),

    UserModule,
    AuthModule,
    ProjectModule,
    AssignmentModule,
    MilestoneModule,
    ProjectMemberModule,
    ManuscriptModule,
    ArchiveLogModule,
    DefenseScheduleModule,
    PanelAssignmentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
})
export class AppModule { }
