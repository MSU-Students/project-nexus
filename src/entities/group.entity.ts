import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'group_name' })
  groupName: string;

  @Column({ nullable: true })
  section: string;

  @Column({ name: 'academic_year', nullable: true })
  academicYear: string;
}
