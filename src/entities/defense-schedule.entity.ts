import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('defense_schedules')
export class DefenseSchedule {
  @PrimaryGeneratedColumn()
  id: number;
}