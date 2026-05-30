import { Role } from 'src/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PanelAssignment } from './panel-assignment.entity';
import { Project } from './project.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ name: 'full_name' })
  fullName: string;

  @Index()
  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Index()
  @Column({ type: 'enum', enum: Role, default: Role.STUDENT })
  role: Role;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => PanelAssignment, (pa: PanelAssignment) => pa.faculty)
  panelAssignments: PanelAssignment[];

  @OneToMany(() => Project, (p: Project) => p.createdBy)
  createdProjects: Project[];
}
