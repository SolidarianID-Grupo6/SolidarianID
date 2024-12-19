import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [HistoryModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
