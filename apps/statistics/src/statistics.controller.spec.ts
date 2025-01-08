import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { beforeEach, describe, it } from 'node:test';

describe('StatisticsController', () => {
  let statisticsController: StatisticsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [StatisticsService],
    }).compile();

    statisticsController = app.get<StatisticsController>(StatisticsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      //expect(statisticsController.getHello()).toBe('Hello World!');
    });
  });
});
