
import { Model } from 'mongoose';
import { expect } from '@jest/globals';
import { InformationService } from './information/information.service';
import { CommunityStats } from './information/schemas/Information.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ODS_ENUM } from 'libs/enums/ods.enum';
import { DonateEventDto } from 'libs/events/dto/donate-event-dto';

describe('InformationService', () => {
    let service: InformationService;
    let model: Model<CommunityStats>;

    const mockCommunityStats = {
        community_id: 'community-1',
        name: 'Test Community',
        causes: [
            {
                cause_id: 'cause-1',
                title: 'Test Cause',
                ods: ['ODS1', 'ODS2'],
                total_supporters: 5,
                actions: [
                    {
                        action_id: 'action-1',
                        title: 'Test Action',
                        description: 'Test Description',
                        goal: 100,
                        progress: 50
                    }
                ]
            }
        ],
        total_members: 10,
        save: jest.fn(),
        markModified: jest.fn()
    };

    const mockModel = {
        find: jest.fn(),
        findOne: jest.fn(),
        findOneAndUpdate: jest.fn(),
        // Add constructor functionality to the mock
        constructor: jest.fn().mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(mockCommunityStats)
        })),
    };


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InformationService,
                {
                    provide: getModelToken(CommunityStats.name),
                    useValue: mockModel,
                },
            ],
        }).compile();

        service = module.get<InformationService>(InformationService);
        model = module.get<Model<CommunityStats>>(getModelToken(CommunityStats.name));
    });

    describe('getOdsByComunidad', () => {
        it('should return unique ODS for a community', async () => {
            jest.spyOn(mockModel, 'findOne').mockResolvedValue(mockCommunityStats);

            const result = await service.getOdsByComunidad('community-1');
            expect(result).toEqual(['ODS1', 'ODS2']);
        });
    });

    describe('getCommunitiesByODS', () => {
        it('should return ODS count across communities', async () => {
            jest.spyOn(mockModel, 'find').mockReturnValue({
                exec: jest.fn().mockResolvedValue([mockCommunityStats])
            } as any);

            const result = await service.getCommunitiesByODS();
            expect(result).toHaveProperty('ODS1');
            expect(result).toHaveProperty('ODS2');
        });
    });

    describe('getSupportByCommunity', () => {
        it('should return support count per community', async () => {
            jest.spyOn(mockModel, 'find').mockReturnValue({
                exec: jest.fn().mockResolvedValue([mockCommunityStats])
            } as any);

            const result = await service.getSupportByCommunity();
            expect(result).toHaveProperty('Test Community', 5);
        });
    });

    describe('getActionProgressByCommunity', () => {
        it('should return action progress for communities', async () => {
            jest.spyOn(mockModel, 'find').mockReturnValue({
                exec: jest.fn().mockResolvedValue([mockCommunityStats])
            } as any);

            const result = await service.getActionProgressByCommunity();
            expect(result['Test Community'][0]).toHaveProperty('percentageComplete', 50);
        });
    });

    describe('donateorVolunteer', () => {
        it('should update action progress', async () => {
            const donateDto: DonateEventDto = {
                causeId: 'cause-1',
                actionId: 'action-1',
                progress: 10,
                user: 'user-1',
                type: 'donate'
            };

            jest.spyOn(mockModel, 'findOne').mockResolvedValue(mockCommunityStats);

            await service.donateorVolunteer(donateDto);
            expect(mockCommunityStats.markModified).toHaveBeenCalled();
            expect(mockCommunityStats.save).toHaveBeenCalled();
        });
    });
});
