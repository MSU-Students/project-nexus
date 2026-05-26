import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { AssignmentModule } from './assignment/assignment.module';
import { MilestoneModule } from './milestone/milestone.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards';
import { AuthGuard } from './auth/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_NAME', 'project_nexus'),
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
        synchronize: true,
      }),
    }),

    UserModule,
    AuthModule,
    ProjectModule,
    AssignmentModule,
    MilestoneModule,
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
  ],
})
export class AppModule { }