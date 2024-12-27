import { Test, TestingModule } from '@nestjs/testing';
import { CommunityRequestsService } from './community-requests.service';

describe('CommunityRequestsService', () => {
  let service: CommunityRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunityRequestsService],
    }).compile();

    service = module.get<CommunityRequestsService>(CommunityRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
