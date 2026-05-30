import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Stage } from './stage.entity';
import { User } from './user.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  title: string;

  @Index({ fulltext: true })
  @Column({ nullable: true, type: 'text' })
  abstract: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ name: 'stage_id', nullable: true })
  stageId: number;

  @ManyToOne(() => Stage, { nullable: true, eager: false })
  @JoinColumn({ name: 'stage_id' })
  stage: Stage;

  @Column({ name: 'group_id', nullable: true })
  groupId: number;

  @Index()
  @Column({ name: 'adviser_id', nullable: true })
  adviserId: number;

  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'adviser_id' })
  adviser: User;

  @Index()
  @Column({ nullable: true })
  year: string;

  @Index()
  @Column({ name: 'tech_stack', nullable: true })
  techStack: string;

  @Column({ name: 'created_by', nullable: true })
  createdById: number;

  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
