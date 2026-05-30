import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DefenseType {
  TITLE_DEFENSE = 'TITLE_DEFENSE',
  PROPOSAL = 'PROPOSAL',
  FINAL_DEFENSE = 'FINAL_DEFENSE',
}

export enum ScheduleStatus {
  SCHEDULED = 'SCHEDULED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('defense_schedules')
export class DefenseSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: DefenseType })
  defenseType: DefenseType;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column()
  room: string;

  @Column({
    type: 'enum',
    enum: ScheduleStatus,
    default: ScheduleStatus.SCHEDULED,
  })
  status: ScheduleStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
