import { Role } from 'src/enums';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PanelAssignment } from './panel-assignment.entity';
import { Project } from './project.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.STUDENT })
    role: Role;

    @OneToMany(() => PanelAssignment, (pa: PanelAssignment) => pa.faculty)
    panelAssignments: PanelAssignment[];

    @OneToMany(() => Project, (p: Project) => p.createdBy)
    createdProjects: Project[];
}