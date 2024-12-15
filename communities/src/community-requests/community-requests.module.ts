import { Module } from '@nestjs/common';
import { CommunityRequestsService } from './community-requests.service';
import { CommunityRequestsController } from './community-requests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommunityRequests, CommunityRequestsSchema } from './schemas/community-requests.schema';
import { Community, CommunitySchema } from '../community/schemas/community.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: CommunityRequests.name, schema: CommunityRequestsSchema }]), 
  MongooseModule.forFeature([{ name: Community.name, schema: CommunitySchema }])],
  controllers: [CommunityRequestsController],
  providers: [CommunityRequestsService],
})
export class CommunityRequestsModule {}
