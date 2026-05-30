import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { Milestone } from './milestone.entity';

@Entity('project_milestones')
export class ProjectMilestone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @ManyToOne(() => Project, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'milestone_id' })
  milestoneId: number;

  @ManyToOne(() => Milestone, { eager: false })
  @JoinColumn({ name: 'milestone_id' })
  milestone: Milestone;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true, type: 'text' })
  remarks: string;

  @Column({ name: 'submitted_at', nullable: true, type: 'timestamptz' })
  submittedAt: Date;

  @Column({ name: 'reviewed_at', nullable: true, type: 'timestamptz' })
  reviewedAt: Date;
}
