import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stages')
export class Stage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'sequence_order' })
  sequenceOrder: number;

  @Column({ nullable: true, type: 'text' })
  description: string;
}
