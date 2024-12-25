import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { Community, CommunitySchema } from './schemas/community.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Community.name, schema: CommunitySchema }])],
  controllers: [CommunityController],
  providers: [CommunityService],
  exports: [CommunityService]
})
export class CommunityModule {}
