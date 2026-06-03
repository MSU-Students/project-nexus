import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity('panel_assignments')
@Unique(['schedule', 'faculty'])
export class PanelAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('DefenseSchedule', { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'schedule_id' })
  schedule: any;

  @ManyToOne(() => User, (user) => user.panelAssignments, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @Column({ name: 'faculty_id' })
  facultyId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'facultyId' })
  faculty!: User;

  @CreateDateColumn()
  assignedAt: Date;
}
