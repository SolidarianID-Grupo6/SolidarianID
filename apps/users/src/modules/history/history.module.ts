import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './persistence/history.entity';
import { User } from '../users/persistence/user.entity';
import { HistoryServiceImpl } from './history.service.implementation';
import { HistoryRepoImpl } from './history.repository.implementation';

@Module({
  imports: [TypeOrmModule.forFeature([User, History])],
  controllers: [HistoryController],
  providers: [
    {
      provide: 'HistoryService',
      useClass: HistoryServiceImpl,
    },
    {
      provide: 'HistoryRepo',
      useClass: HistoryRepoImpl,
    },
  ],
})
export class HistoryModule {}
