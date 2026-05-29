import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('archive_logs')
export class ArchiveLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'entity_type' })
    entityType: string;

    @Column({ name: 'entity_id' })
    entityId: number;

    @Column()
    action: string;

    @Column({ name: 'changed_by', nullable: true })
    changedById: number;

    @ManyToOne(() => User, { nullable: true, eager: false })
    @JoinColumn({ name: 'changed_by' })
    changedBy: User;

    @Column({ name: 'old_values', nullable: true, type: 'json' })
    oldValues: Record<string, any>;

    @Column({ name: 'new_values', nullable: true, type: 'json' })
    newValues: Record<string, any>;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
