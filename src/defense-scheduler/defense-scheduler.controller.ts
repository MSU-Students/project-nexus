import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DefenseSchedulerService } from './defense-scheduler.service';
import { CreateDefenseSchedulerDto } from './dto/create-defense-scheduler.dto';
import { UpdateDefenseSchedulerDto } from './dto/update-defense-scheduler.dto';

@Controller('defense-scheduler')
export class DefenseSchedulerController {
  constructor(private readonly defenseSchedulerService: DefenseSchedulerService) {}

  @Post()
  create(@Body() createDefenseSchedulerDto: CreateDefenseSchedulerDto) {
    return this.defenseSchedulerService.create(createDefenseSchedulerDto);
  }

  @Get()
  findAll() {
    return this.defenseSchedulerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.defenseSchedulerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDefenseSchedulerDto: UpdateDefenseSchedulerDto) {
    return this.defenseSchedulerService.update(+id, updateDefenseSchedulerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.defenseSchedulerService.remove(+id);
  }
}
