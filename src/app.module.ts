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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'rootpass',
      database: 'project-nexus-db',
      entities: [User, Project, ProjectMember, Manuscript],
      synchronize: true,
    }),
    CommonModule,
    UserModule,
    AuthModule,
    ProjectModule,
    ProjectMemberModule,
    ManuscriptModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
