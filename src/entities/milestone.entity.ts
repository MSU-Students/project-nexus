import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('milestones')
export class Milestone {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true, type: 'text' })
    description: string;

    @Column({ name: 'due_date', nullable: true, type: 'date' })
    dueDate: Date;
}
