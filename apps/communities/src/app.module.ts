import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CauseModule } from './cause/cause.module';
import { CommunityModule } from './community/community.module';
import { ActionModule } from './action/action.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from './event/event.module';
import { ConfigModule } from '@nestjs/config';
import { CommunityRequestsModule } from './community-requests/community-requests.module';
import { CommunityJoinRequestModule } from './community-join-request/community-join-request.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@mongo:${process.env.MONGO_PORT}/`,
    ),
    ActionModule,
    CommunityModule,
    CommunityRequestsModule,
    CommunityJoinRequestModule,
    CauseModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
