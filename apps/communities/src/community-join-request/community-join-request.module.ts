import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommunityJoinRequestService } from './community-join-request.service';
import { CommunityJoinRequestController } from './community-join-request.controller';
import { CommunityJoinRequestSchema } from './schemas/community-join-request.schema';
import { CommunityJoinRequest } from './entities/community-join-request.entity';
import { CommunityModule } from '../community/community.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: CommunityJoinRequest.name, schema: CommunityJoinRequestSchema }]),  forwardRef(() => CommunityModule)
],
  controllers: [CommunityJoinRequestController],
  providers: [CommunityJoinRequestService],
  exports: [CommunityJoinRequestService]
})
export class CommunityJoinRequestModule {}
