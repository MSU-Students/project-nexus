import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('advisers')
export class Adviser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'faculty_id', unique: true })
    facultyId: number;

    @OneToOne(() => User, { eager: false })
    @JoinColumn({ name: 'faculty_id' })
    faculty: User;

    @Column({ nullable: true })
    specialization: string;

    @Column({ name: 'max_groups', default: 0 })
    maxGroups: number;
}
