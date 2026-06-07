import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { AssignmentModule } from './assignment/assignment.module';
import { MilestoneModule } from './milestone/milestone.module';
import { AuditModule } from './audit/audit.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from './guards';
import { AuthGuard } from './auth/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DefenseSchedule } from './entities/defense-schedule.entity';
import { PanelAssignment } from './entities/panel-assignment.entity';
import { AuditLog } from './audit/audit-log.entity';
import { AuditInterceptor } from './audit/audit.interceptor';
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
          AuditLog,
        ],
        synchronize: true,
      }),
    }),

    UserModule,
    AuthModule,
    ProjectModule,
    AssignmentModule,
    MilestoneModule,
    AuditModule,
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
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule { }