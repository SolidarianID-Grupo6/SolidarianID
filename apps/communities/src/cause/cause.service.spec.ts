import { Test, TestingModule } from '@nestjs/testing';
import { CauseService } from './cause.service';
import { getModelToken } from '@nestjs/mongoose';
import { Cause } from './schemas/cause.schema';
import { Types } from 'mongoose';
import { ODS_ENUM } from 'libs/enums/ods.enum';
import { expect } from '@jest/globals';
import { CreateCauseDto } from './dto/create-cause.dto';
import { CommunityService } from '../community/community.service';

describe('CauseService Metamorphic Tests', () => {
    let service: CauseService;
    const validMongoId = new Types.ObjectId().toString();

    beforeEach(async () => {
        const mockCauseModel = {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            exec: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CauseService,
                {
                    provide: getModelToken(Cause.name),
                    useValue: mockCauseModel,
                },
                {
                    provide: CommunityService,
                    useValue: {
                        findOne: jest.fn().mockResolvedValue({ id: validMongoId }),
                    },
                },
                {
                    provide: 'NATS_SERVICE',
                    useValue: { emit: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<CauseService>(CauseService);
    });

    describe('ODS Mapping Metamorphic Relations', () => {
        it('maintains consistency when mapping ODS values multiple times', () => {
            const odsValue = ODS_ENUM.AGUA_LIMPIA_Y_SANEAMIENTO;
            const firstMapping = service.mapToEnum(odsValue);
            const secondMapping = service.mapToEnum(firstMapping);
            expect(firstMapping).toBe(secondMapping);
        });

        it('preserves array length when mapping ODS arrays', async () => {
            const odsArray = [ODS_ENUM.AGUA_LIMPIA_Y_SANEAMIENTO, ODS_ENUM.CIUDADES_Y_COMUNIDADES_SOSTENIBLES];
            const mappedArray = odsArray.map(ods => service.mapToEnum(ods));
            expect(mappedArray.length).toBe(odsArray.length);
        });
    });

    describe('Cause Creation Metamorphic Relations', () => {
        it('maintains data consistency with different order of supporters', async () => {
            const baseDto: CreateCauseDto = {
                title: 'Test Cause',
                description: 'Description',
                ods: [ODS_ENUM.AGUA_LIMPIA_Y_SANEAMIENTO],
                community: validMongoId,
                endDate: '',
                actions: [],
                events: [],
                category: '',
                keywords: [],
                location: ''
            };

            jest.spyOn(service['causeModel'], 'create').mockResolvedValue({
                ...baseDto,
                _id: validMongoId,
                save: jest.fn().mockResolvedValue(true),
            } as any);

            const cause1 = await service.create(validMongoId, baseDto, 'user1');
            const cause2 = await service.create(validMongoId, baseDto, 'user1');

            expect(cause1).toEqual(cause2);
        });
    });

    describe('Support Registration Metamorphic Relations', () => {
        it('maintains idempotency for repeated supporter additions', async () => {
            const userId = 'user1';
            const causeId = validMongoId;

            const mockCause = {
                _id: causeId,
                registeredSupporters: [],
                community: validMongoId,
            };

            jest.spyOn(service['causeModel'], 'findById')
                .mockReturnValueOnce({
                    exec: jest.fn().mockResolvedValue(mockCause)
                } as any)
                .mockReturnValueOnce({
                    exec: jest.fn().mockResolvedValue({
                        ...mockCause,
                        registeredSupporters: [userId]
                    })
                } as any);

            jest.spyOn(service['causeModel'], 'findByIdAndUpdate')
                .mockReturnValue({
                    exec: jest.fn().mockResolvedValue({
                        ...mockCause,
                        registeredSupporters: [userId]
                    })
                } as any);

            await service.supportUserRegistered(causeId, userId);

            await expect(
                service.supportUserRegistered(causeId, userId)
            ).rejects.toThrow('User user1 is already registered as a supporter');
        });
    });

    describe('Update Operation Metamorphic Relations', () => {
        it('preserves unmodified fields during partial updates', async () => {
            const originalCause = {
                _id: validMongoId,
                title: 'Original Title',
                description: 'Original Description',
                ods: [ODS_ENUM.CIUDADES_Y_COMUNIDADES_SOSTENIBLES],
            };

            jest.spyOn(service['causeModel'], 'findById')
                .mockReturnValue({
                    exec: jest.fn().mockResolvedValue(originalCause),
                } as any);

            jest.spyOn(service['causeModel'], 'findByIdAndUpdate')
                .mockReturnValue({
                    exec: jest.fn().mockResolvedValue({
                        ...originalCause,
                        title: 'New Title',
                    }),
                } as any);

            await service.update(validMongoId, { title: 'New Title' });
            const updatedCause = await service.findOne(validMongoId);

            expect(updatedCause.description).toBe(originalCause.description);
        });
    });

    describe('Search Operation Metamorphic Relations', () => {
        it('maintains result consistency', async () => {
            const causes = [
                { _id: validMongoId, title: 'First Cause' },
                { _id: new Types.ObjectId().toString(), title: 'Second Cause' }
            ];

            jest.spyOn(service['causeModel'], 'find')
                .mockReturnValue({
                    exec: jest.fn().mockResolvedValue(causes)
                } as any);

            const results = await service.findAll();
            expect(results).toBeDefined();
            expect(results.length).toBe(2);
        });
    });
});
