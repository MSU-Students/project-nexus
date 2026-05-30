import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { Stage } from './stage.entity';
import { User } from './user.entity';

@Entity('project_stage_history')
export class ProjectStageHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @ManyToOne(() => Project, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'old_stage_id', nullable: true })
  oldStageId?: number;

  @ManyToOne(() => Stage, { nullable: true, eager: false })
  @JoinColumn({ name: 'old_stage_id' })
  oldStage: Stage;

  @Column({ name: 'new_stage_id' })
  newStageId: number;

  @ManyToOne(() => Stage, { eager: false })
  @JoinColumn({ name: 'new_stage_id' })
  newStage: Stage;

  @Column({ name: 'changed_by', nullable: true })
  changedBy?: number;

  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'changed_by' })
  changedByUser: User;

  @CreateDateColumn({ name: 'changed_at' })
  changedAt: Date;
}
