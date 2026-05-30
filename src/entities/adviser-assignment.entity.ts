import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Adviser } from './adviser.entity';
import { Group } from './group.entity';
import { User } from './user.entity';

@Entity('adviser_assignments')
export class AdviserAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'adviser_id' })
  adviserId: number;

  @ManyToOne(() => Adviser, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'adviser_id' })
  adviser: Adviser;

  @Column({ name: 'group_id' })
  groupId: number;

  @ManyToOne(() => Group, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column({ name: 'assigned_by', nullable: true })
  assignedBy?: number;

  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'assigned_by' })
  assignedByUser: User;

  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt: Date;
}
