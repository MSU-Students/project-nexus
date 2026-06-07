import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';
import { AuditService } from './audit.service';

describe('AuditService', () => {
  let service: AuditService;
  let repo: Repository<AuditLog>;

  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((log) => Promise.resolve({ id: 1, ...log })),
    find: jest.fn().mockImplementation(() => Promise.resolve([])),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: getRepositoryToken(AuditLog),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
    repo = module.get<Repository<AuditLog>>(getRepositoryToken(AuditLog));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logAction', () => {
    it('should save an audit log', async () => {
      const data = { action: 'LOGIN', affectedModule: 'AUTH' };
      const res = await service.logAction(data);
      expect(res).toEqual({ id: 1, ...data });
      expect(repo.create).toHaveBeenCalledWith(data);
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should query all audit logs', async () => {
      const res = await service.findAll();
      expect(res).toEqual([]);
      expect(repo.find).toHaveBeenCalled();
    });
  });
});
