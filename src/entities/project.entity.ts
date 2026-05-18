import { Column, PrimaryGeneratedColumn } from 'typeorm';

export type ProjectType = 'capstone' | 'thesis';
export class Project {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column({nullable: true})
    description: string | null;
    @Column()
    type: ProjectType;
}
