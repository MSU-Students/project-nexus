import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('advisers')
export class Adviser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'faculty_id' })
  facultyId: number;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'faculty_id' })
  faculty: User;

  @Column({ nullable: true })
  specialization: string;

  @Column({ name: 'max_groups', nullable: true })
  maxGroups: number;
}
