import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { User } from 'src/entities';
import { Role } from 'src/enums';
import { QueryFailedError, Repository } from 'typeorm';

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
    async findOne(username: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: {
                username: username
            }
        });
    }
    async create(createDto: CreateUserDto): Promise<User> {
        const user = this.usersRepository.create(createDto);

        try {
            return await this.usersRepository.save(user);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                const driverError = error.driverError as { code?: string; detail?: string };
                const isUniqueViolation = driverError?.code === '23505';
                const hasUsernameConflict = driverError?.detail?.includes('(username)=');

                if (isUniqueViolation && hasUsernameConflict) {
                    throw new ConflictException('Username already exists');
                }
            }

            throw error;
        }
    }
}