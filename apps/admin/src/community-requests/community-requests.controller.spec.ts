import { Test, TestingModule } from '@nestjs/testing';
import { CommunityRequestsController } from './community-requests.controller';
import { CommunityRequestsService } from './community-requests.service';

describe('CommunityRequestsController', () => {
  let controller: CommunityRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunityRequestsController],
      providers: [CommunityRequestsService],
    }).compile();

    controller = module.get<CommunityRequestsController>(CommunityRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
