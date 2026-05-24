import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule, AuthGuard, RolesGuard } from './common';
import { UserModule } from './users/user.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './projects/project.module';
import { Project } from './projects/project.entity';
import { ProjectMemberModule } from './project-members/project-member.module';
import { ProjectMember } from './project-members/project-member.entity';
import { ManuscriptModule } from './manuscripts/manuscript.module';
import { Manuscript } from './manuscripts/manuscript.entity';
import { ArchiveLogModule } from './archive-logs/archive-log.module';
import { ArchiveLog } from './archive-logs/archive-log.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'rootpass',
      database: 'project-nexus-db',
      entities: [User, Project, ProjectMember, Manuscript, ArchiveLog],
      synchronize: true,
      // Production: Set synchronize: false and run the migration manually:
      //   psql -U root -d project-nexus-db -f src/database/migrations/001-initial-schema.sql
    }),
    CommonModule,
    UserModule,
    AuthModule,
    ProjectModule,
    ProjectMemberModule,
    ManuscriptModule,
    ArchiveLogModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
