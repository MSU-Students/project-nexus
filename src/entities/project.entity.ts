import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Stage } from './stage.entity';
import { User } from './user.entity';

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true, type: 'text' })
    description: string;

    @Column({ name: 'stage_id', nullable: true })
    stageId: number;

    @ManyToOne(() => Stage, { nullable: true, eager: false })
    @JoinColumn({ name: 'stage_id' })
    stage: Stage;

    @Column({ name: 'group_id', nullable: true })
    groupId: number;

    @Column({ name: 'adviser_id', nullable: true })
    adviserId: number;

    @ManyToOne(() => User, { nullable: true, eager: false })
    @JoinColumn({ name: 'adviser_id' })
    adviser: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
