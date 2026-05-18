import { ProjectType } from 'src/entities';

export class CreateProjectDto {
    name: string;
    description: string | null;
    type: ProjectType;
}
