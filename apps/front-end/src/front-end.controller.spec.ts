import { Test, TestingModule } from '@nestjs/testing';
import { FrontEndController } from './front-end.controller';
import { FrontEndService } from './front-end.service';

describe('FrontEndController', () => {
  let frontEndController: FrontEndController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FrontEndController],
      providers: [FrontEndService],
    }).compile();

    frontEndController = app.get<FrontEndController>(FrontEndController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(frontEndController.getHello()).toBe('Hello World!');
    });
  });
});
