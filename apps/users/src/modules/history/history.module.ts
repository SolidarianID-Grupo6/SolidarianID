import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/persistence/user.entity';
import { History } from './entities/history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, History])],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
