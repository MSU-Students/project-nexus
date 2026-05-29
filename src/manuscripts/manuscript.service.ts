import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manuscript } from 'src/entities/manuscript.entity';
import { CreateManuscriptDto } from 'src/dto/create-manuscript.dto';

@Injectable()
export class ManuscriptService {
    constructor(
        @InjectRepository(Manuscript)
        private readonly repo: Repository<Manuscript>,
    ) {}

    async create(dto: CreateManuscriptDto): Promise<Manuscript> {
        const manuscript = this.repo.create(dto);
        return this.repo.save(manuscript);
    }

    async findAll(): Promise<Manuscript[]> {
        return this.repo.find({
            relations: ['project'],
            order: { submittedAt: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Manuscript> {
        const manuscript = await this.repo.findOne({
            where: { id },
            relations: ['project'],
        });
        if (!manuscript) throw new NotFoundException(`Manuscript #${id} not found`);
        return manuscript;
    }

    async findByProject(projectId: number): Promise<Manuscript[]> {
        return this.repo.find({
            where: { projectId },
            order: { submittedAt: 'DESC' },
        });
    }

    async remove(id: number): Promise<void> {
        const manuscript = await this.findOne(id);
        await this.repo.remove(manuscript);
    }
}
