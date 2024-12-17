import { Test, TestingModule } from '@nestjs/testing';
import { CauseController } from './cause.controller';
import { CauseService } from './cause.service';

describe('CauseController', () => {
  let controller: CauseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CauseController],
      providers: [CauseService],
    }).compile();

    controller = module.get<CauseController>(CauseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
