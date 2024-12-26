import { Test, TestingModule } from '@nestjs/testing';
import { CommunityJoinRequestService } from './community-join-request.service';

describe('CommunityJoinRequestService', () => {
  let service: CommunityJoinRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunityJoinRequestService],
    }).compile();

    service = module.get<CommunityJoinRequestService>(CommunityJoinRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
