import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CauseModule } from './cause/cause.module';
import { CommunityModule } from './community/community.module';
import { ActionModule } from './action/action.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommunityRequestsModule } from './community-requests/community-requests.module';

@Module({
  imports: [MongooseModule.forRoot(`mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`)    ,
    ActionModule, CommunityModule, CauseModule, CommunityRequestsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
