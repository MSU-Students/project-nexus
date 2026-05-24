import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../app.module';
import { User } from '../../users/user.entity';
import { Project } from '../../projects/project.entity';
import { ProjectMember } from '../../project-members/project-member.entity';
import { Role } from '../../common';

async function bootstrap() {
  console.log('=== Database Seeder ===\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // ── Clear existing data ──
    console.log('Clearing existing data...');
    await queryRunner.manager.delete(ProjectMember, {});
    await queryRunner.manager.delete(Project, {});
    await queryRunner.manager.delete(User, {});

    // ── Seed users ──
    console.log('Creating users...');
    const salt = await bcrypt.genSalt();

    const admin = queryRunner.manager.create(User, {
      fullName: 'Admin User',
      email: 'admin@archive.com',
      passwordHash: await bcrypt.hash('Admin@2024', salt),
      role: Role.Admin,
    });
    await queryRunner.manager.save(admin);
    console.log(`  ✓ Admin: admin@archive.com / Admin@2024`);

    const adviser = queryRunner.manager.create(User, {
      fullName: 'Jane Adviser',
      email: 'adviser@archive.com',
      passwordHash: await bcrypt.hash('Adviser@2024', salt),
      role: Role.Adviser,
    });
    await queryRunner.manager.save(adviser);
    console.log(`  ✓ Adviser: adviser@archive.com / Adviser@2024`);

    const student = queryRunner.manager.create(User, {
      fullName: 'Alice Student',
      email: 'student@archive.com',
      passwordHash: await bcrypt.hash('Student@2024', salt),
      role: Role.Student,
    });
    await queryRunner.manager.save(student);
    console.log(`  ✓ Student: student@archive.com / Student@2024`);

    // ── Seed project ──
    console.log('Creating sample project...');
    const project = queryRunner.manager.create(Project, {
      title: 'AI-Powered Document Classification System',
      abstract:
        'This study explores the application of machine learning algorithms for automated classification of academic documents.',
      year: 2024,
      adviserId: adviser.id,
      techStack: ['Python', 'TensorFlow', 'Flask', 'PostgreSQL'],
      createdById: student.id,
    });
    await queryRunner.manager.save(project);
    console.log(`  ✓ Project: "${project.title}"`);

    // ── Seed project membership ──
    console.log('Creating project membership...');
    const membership = queryRunner.manager.create(ProjectMember, {
      projectId: project.id,
      userId: student.id,
      roleInProject: 'leader',
    });
    await queryRunner.manager.save(membership);
    console.log(`  ✓ ${student.fullName} added to project as "${membership.roleInProject}"`);

    await queryRunner.commitTransaction();
    console.log('\n=== Seed completed successfully ===');
  } catch (err) {
    await queryRunner.rollbackTransaction();
    console.error('\nSeed failed, transaction rolled back:', err);
    throw err;
  } finally {
    await queryRunner.release();
    await app.close();
  }
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
