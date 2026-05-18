import { Injectable } from '@nestjs/common';
import { CreateDefenseSchedulerDto } from './dto/create-defense-scheduler.dto';
import { UpdateDefenseSchedulerDto } from './dto/update-defense-scheduler.dto';

@Injectable()
export class DefenseSchedulerService {
  create(createDefenseSchedulerDto: CreateDefenseSchedulerDto) {
    return 'This action adds a new defenseScheduler';
  }

  findAll() {
    return `This action returns all defenseScheduler`;
  }

  findOne(id: number) {
    return `This action returns a #${id} defenseScheduler`;
  }

  update(id: number, updateDefenseSchedulerDto: UpdateDefenseSchedulerDto) {
    return `This action updates a #${id} defenseScheduler`;
  }

  remove(id: number) {
    return `This action removes a #${id} defenseScheduler`;
  }
}
