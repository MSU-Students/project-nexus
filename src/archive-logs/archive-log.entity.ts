import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('archive_logs')
@Index(['userId'])
@Index(['targetType'])
@Index(['createdAt'])
export class ArchiveLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: true })
  userId?: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 50 })
  action: string;

  @Column({ name: 'target_type', length: 50 })
  targetType: string;

  @Column({ name: 'target_id', nullable: true })
  targetId?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
