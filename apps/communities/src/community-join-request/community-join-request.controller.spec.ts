import { Test, TestingModule } from '@nestjs/testing';
import { CommunityJoinRequestController } from './community-join-request.controller';
import { CommunityJoinRequestService } from './community-join-request.service';

describe('CommunityJoinRequestController', () => {
  let controller: CommunityJoinRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunityJoinRequestController],
      providers: [CommunityJoinRequestService],
    }).compile();

    controller = module.get<CommunityJoinRequestController>(CommunityJoinRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
