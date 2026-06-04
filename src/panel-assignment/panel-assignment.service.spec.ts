import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AssignPanelDto } from '../dto';
import { PanelAssignment } from '../entities/panel-assignment.entity';
import { User } from '../entities/user.entity';
import { Role } from '../enums';
import { PanelAssignmentController } from './panel-assignment.controller';
import { PanelAssignmentService } from './panel-assignment.service';

// Pinapatay nito ang lahat ng type environment warnings sa editor mo
declare const jest: any;
declare const describe: any;
declare const beforeEach: any;
declare const afterEach: any;
declare const it: any;
declare const expect: any;

describe('PanelAssignment System - Task 2', () => {
    let service: PanelAssignmentService;
    let controller: PanelAssignmentController;

    const mockPanelRepo = {
        count: typeof jest !== 'undefined' ? jest.fn() : (() => Promise.resolve(0)) as any,
        findOne: typeof jest !== 'undefined' ? jest.fn() : (() => Promise.resolve(null)) as any,
        create: typeof jest !== 'undefined' ? jest.fn() : (() => ({})) as any,
        save: typeof jest !== 'undefined' ? jest.fn() : (() => Promise.resolve({})) as any,
        find: typeof jest !== 'undefined' ? jest.fn() : (() => Promise.resolve([])) as any,
    };

    const mockUserRepo = {
        findOne: typeof jest !== 'undefined' ? jest.fn() : (() => Promise.resolve(null)) as any,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PanelAssignmentController],
            providers: [
                PanelAssignmentService,
                {
                    provide: getRepositoryToken(PanelAssignment),
                    useValue: mockPanelRepo,
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepo,
                },
            ],
        }).compile();

        service = module.get<PanelAssignmentService>(PanelAssignmentService);
        controller = module.get<PanelAssignmentController>(PanelAssignmentController);
    });

    afterEach(() => {
        if (typeof jest !== 'undefined' && jest.clearAllMocks) {
            jest.clearAllMocks();
        }
    });

    describe('Business Rule Validations', () => {
        it('should throw BadRequestException if user role is not FACULTY', async () => {
            const dto: AssignPanelDto = { scheduleId: 1, facultyId: 5 };
            const mockStudent = { id: 5, name: 'Juan', role: Role.STUDENT };

            if (typeof jest !== 'undefined' && mockUserRepo.findOne.mockResolvedValue) {
                mockUserRepo.findOne.mockResolvedValue(mockStudent);
            }

            await expect(service.assign(dto)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if schedule hits MAX_PANELISTS limit', async () => {
            const dto: AssignPanelDto = { scheduleId: 1, facultyId: 10 };
            const mockFaculty = { id: 10, name: 'Prof. Cruz', role: Role.FACULTY };

            if (typeof jest !== 'undefined' && mockUserRepo.findOne.mockResolvedValue) {
                mockUserRepo.findOne.mockResolvedValue(mockFaculty);
                mockPanelRepo.count.mockResolvedValue(3);
            }

            await expect(service.assign(dto)).rejects.toThrow(BadRequestException);
        });
    });
});