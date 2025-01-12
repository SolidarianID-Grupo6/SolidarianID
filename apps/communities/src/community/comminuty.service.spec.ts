import { Test, TestingModule } from '@nestjs/testing';
import { CommunityService } from './community.service';
import { getModelToken } from '@nestjs/mongoose';
import { Community } from './schemas/community.schema';
import { CauseService } from '../cause/cause.service';
import { ClientProxy } from '@nestjs/microservices';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { expect } from '@jest/globals';

describe('CommunityService', () => {
    let service: CommunityService;
    let communityModel: Model<Community>;
    let causeService: CauseService;
    let clientProxy: ClientProxy;

    const mockCommunityModel = {
        find: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        save: jest.fn(),
        new: jest.fn().mockImplementation(() => ({
            save: () => mockCommunity
        })),
    };

    const mockClientProxy = {
        emit: jest.fn(),
    };

    const mockCauseService = {
        create: jest.fn(),
        mapToEnum: jest.fn(),
    };

    const mockCommunity = {
        _id: 'community-id-1',
        name: 'Test Community',
        description: 'Test Description',
        creator: 'user-id-1',
        members: ['user-id-1'],
        admins: ['user-id-1'],
        causes: [],
        creationDate: new Date(),
        save: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommunityService,
                {
                    provide: getModelToken(Community.name),
                    useValue: mockCommunityModel,
                },
                {
                    provide: 'NATS_SERVICE',
                    useValue: mockClientProxy,
                },
                {
                    provide: CauseService,
                    useValue: mockCauseService,
                },
            ],
        }).compile();

        service = module.get<CommunityService>(CommunityService);
        communityModel = module.get<Model<Community>>(getModelToken(Community.name));
        causeService = module.get<CauseService>(CauseService);
        clientProxy = module.get<ClientProxy>('NATS_SERVICE');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of communities', async () => {
            const mockCommunities = [mockCommunity];
            jest.spyOn(mockCommunityModel, 'find').mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockCommunities),
            } as any);

            const result = await service.findAll();
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(mockCommunity._id);
        });
    });

    describe('findOne', () => {
        it('should return a community by id', async () => {
            jest.spyOn(mockCommunityModel, 'findById').mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockCommunity),
            } as any);

            const result = await service.findOne('community-id-1');
            expect(result.id).toBe(mockCommunity._id);
        });

        it('should throw NotFoundException when community not found', async () => {
            jest.spyOn(mockCommunityModel, 'findById').mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            } as any);

            await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
        });
    });

    describe('addMember', () => {
        it('should add a member to community', async () => {
            jest.spyOn(mockCommunityModel, 'findById').mockResolvedValue({
                ...mockCommunity,
                members: ['existing-user'],
            });

            jest.spyOn(mockCommunityModel, 'findByIdAndUpdate').mockReturnValue({
                exec: jest.fn().mockResolvedValue({ ...mockCommunity, members: ['existing-user', 'new-user'] }),
            } as any);

            await service.addMember('community-id-1', 'new-user');
            expect(mockClientProxy.emit).toHaveBeenCalled();
        });

        it('should throw BadRequestException when user is already a member', async () => {
            jest.spyOn(mockCommunityModel, 'findById').mockResolvedValue({
                ...mockCommunity,
                members: ['existing-user'],
            });

            await expect(service.addMember('community-id-1', 'existing-user'))
                .rejects.toThrow(BadRequestException);
        });
    });

    describe('remove', () => {
        it('should remove a community', async () => {
            jest.spyOn(mockCommunityModel, 'findByIdAndDelete').mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockCommunity),
            } as any);

            await service.remove('community-id-1');
            expect(mockCommunityModel.findByIdAndDelete).toHaveBeenCalledWith('community-id-1');
        });

        it('should throw NotFoundException when trying to remove non-existent community', async () => {
            jest.spyOn(mockCommunityModel, 'findByIdAndDelete').mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            } as any);

            await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
        });
    });
});
