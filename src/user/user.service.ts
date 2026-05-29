import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { User } from 'src/entities';
import { QueryFailedError, Repository } from 'typeorm';

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {
    }
    
    async findAll() {
        return this.usersRepository.find()
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { email }
        });
    }

    async create(createDto: CreateUserDto): Promise<User> {
        const passwordHash = await bcrypt.hash(createDto.password, SALT_ROUNDS);
        const user = this.usersRepository.create({
            ...createDto,
            passwordHash,
        });

        try {
            return await this.usersRepository.save(user);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                const driverError = error.driverError as { code?: string; detail?: string };
                const isUniqueViolation = driverError?.code === '23505';
                const hasEmailConflict = driverError?.detail?.includes('(email)=');

                if (isUniqueViolation && hasEmailConflict) {
                    throw new ConflictException('Email already exists');
                }
            }

            throw error;
        }
    }
}