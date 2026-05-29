import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity('manuscripts')
export class Manuscript {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'project_id' })
    projectId: number;

    @ManyToOne(() => Project, { eager: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column()
    title: string;

    @Column({ name: 'file_path' })
    filePath: string;

    @Column({ nullable: true })
    status: string;

    @CreateDateColumn({ name: 'submitted_at' })
    submittedAt: Date;

    @Column({ name: 'reviewed_at', nullable: true, type: 'timestamptz' })
    reviewedAt: Date;

    @Column({ nullable: true, type: 'text' })
    remarks: string;
}
