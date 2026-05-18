import { Test, TestingModule } from '@nestjs/testing';
import { DefenseSchedulerController } from './defense-scheduler.controller';
import { DefenseSchedulerService } from './defense-scheduler.service';

describe('DefenseSchedulerController', () => {
  let controller: DefenseSchedulerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DefenseSchedulerController],
      providers: [DefenseSchedulerService],
    }).compile();

    controller = module.get<DefenseSchedulerController>(DefenseSchedulerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
