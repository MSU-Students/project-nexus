import { Test, TestingModule } from '@nestjs/testing';
import { DefenseSchedulerService } from './defense-scheduler.service';

describe('DefenseSchedulerService', () => {
  let service: DefenseSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DefenseSchedulerService],
    }).compile();

    service = module.get<DefenseSchedulerService>(DefenseSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
