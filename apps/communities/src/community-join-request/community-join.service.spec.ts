import { Test, TestingModule } from '@nestjs/testing';
import { CommunityJoinRequestService } from './community-join-request.service';
import { getModelToken } from '@nestjs/mongoose';
import { CommunityJoinRequest } from './schemas/community-join-request.schema';
import { CommunityService } from '../community/community.service';
import { UserJoinStatus } from './entities/user-request-status.enum';
import { Model } from 'mongoose';
import { CommunityEntity } from '../community/entities/community.entity';
import { expect } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';

describe('CommunityJoinRequestService Integration', () => {
  let service: CommunityJoinRequestService;
  let communityService: CommunityService;
  let requestModel: Model<CommunityJoinRequest>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityJoinRequestService,
        {
          provide: getModelToken(CommunityJoinRequest.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            exec: jest.fn()
          }
        },
        {
          provide: CommunityService,
          useValue: {
            findOne: jest.fn(),
            addMember: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<CommunityJoinRequestService>(CommunityJoinRequestService);
    communityService = module.get<CommunityService>(CommunityService);
    requestModel = module.get<Model<CommunityJoinRequest>>(getModelToken(CommunityJoinRequest.name));
  });

  describe('Request Join Flow', () => {
    it('should complete full join request cycle', async () => {
      // Setup
      const userId = 'user-1';
      const requestDto = { idCommunity: 'community-1' };

      const mockCommunityEntity: CommunityEntity = {
        id: 'community-1',
        name: 'Test Community',
        members: ['user-2'],
        description: 'Test Description',
        creationDate: new Date(),
        creator: 'creator-1',
        admins: ['admin-1'],
        causes: ['cause-1']
      };

      jest.spyOn(communityService, 'findOne').mockResolvedValue(mockCommunityEntity);
      jest.spyOn(requestModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null)
      } as any);
      jest.spyOn(requestModel, 'create').mockResolvedValue({
        _id: 'request-1',
        idCommunity: requestDto.idCommunity,
        userId,
        status: UserJoinStatus.Pending
      } as any);

      // Execute request join
      const requestId = await service.requestJoin(requestDto, userId);
      expect(requestId).toBeDefined();
    });
  });

  describe('Accept Request Flow', () => {
    it('should process request acceptance correctly', async () => {
      const requestId = 'request-1';
      const mockRequest = {
        _id: requestId,
        idCommunity: 'community-1',
        userId: 'user-1',
        status: UserJoinStatus.Pending
      };

      jest.spyOn(requestModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockRequest)
      } as any);
      jest.spyOn(requestModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockRequest,
          status: UserJoinStatus.Approved
        })
      } as any);

      await service.acceptRequest(requestId);
      expect(communityService.addMember).toHaveBeenCalled();
    });
  });

  describe('Reject Request Flow', () => {
    it('should process request rejection correctly', async () => {
      const requestId = 'request-1';
      const mockRequest = {
        _id: requestId,
        idCommunity: 'community-1',
        userId: 'user-1',
        status: UserJoinStatus.Pending
      };

      jest.spyOn(requestModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockRequest)
      } as any);
      jest.spyOn(requestModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockRequest,
          status: UserJoinStatus.Rejected
        })
      } as any);

      await service.rejectRequest(requestId);
    });
  });

  describe('Query Operations', () => {
    it('should find pending requests for a community', async () => {
      const communityId = 'community-1';
      const mockRequests = [
        {
          _id: 'request-1',
          idCommunity: communityId,
          userId: 'user-1',
          status: UserJoinStatus.Pending
        }
      ];

      jest.spyOn(requestModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockRequests)
      } as any);

      const results = await service.findPendingRequestsByCommunity(communityId);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].status).toBe(UserJoinStatus.Pending);
    });
  });

  describe('Error Handling', () => {
    it('should handle duplicate join requests', async () => {
      const userId = 'user-1';
      const requestDto = { idCommunity: 'community-1' };
      const mockCommunity: CommunityEntity = {
        id: 'community-1',
        name: 'Test Community',
        members: ['user-2'],
        description: 'A test community',
        creationDate: new Date(),
        creator: 'user-3',
        admins: ['user-3'],
        causes: []
      };

      jest.spyOn(communityService, 'findOne').mockResolvedValue(mockCommunity);
      jest.spyOn(requestModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue({ exists: true })
      } as any);

      await expect(service.requestJoin(requestDto, userId))
        .rejects
        .toThrow(BadRequestException);
    });
  });
});
