import { Module } from '@nestjs/common';
import { CommunityRequestsService } from './community-requests.service';
import { CommunityRequestsController } from './community-requests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommunityRequests, CommunityRequestsSchema } from './schemas/community-requests.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [MongooseModule.forFeature([{ name: CommunityRequests.name, schema: CommunityRequestsSchema }]),
  ClientsModule.register([
    {
      name: 'NATS_SERVICE',
      transport: Transport.NATS,
      options: {
        servers: ['nats://nats:4222'],
    },
  },
  ])],
  controllers: [CommunityRequestsController],
  providers: [CommunityRequestsService],
})
export class CommunityRequestsModule {}
