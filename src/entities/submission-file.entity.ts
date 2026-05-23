import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectMilestone } from './project-milestone.entity';
import { User } from './user.entity';

@Entity('submission_files')
export class SubmissionFile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'project_milestone_id' })
    projectMilestoneId: number;

    @ManyToOne(() => ProjectMilestone, { eager: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_milestone_id' })
    projectMilestone: ProjectMilestone;

    @Column({ name: 'file_name' })
    fileName: string;

    @Column({ name: 'file_path' })
    filePath: string;

    @Column({ name: 'uploaded_by', nullable: true })
    uploadedBy: number;

    @ManyToOne(() => User, { nullable: true, eager: false })
    @JoinColumn({ name: 'uploaded_by' })
    uploadedByUser: User;
}
