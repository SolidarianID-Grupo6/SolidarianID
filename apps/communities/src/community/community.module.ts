import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { Community, CommunitySchema } from './schemas/community.schema';
import { CommunityJoinRequestModule } from '../community-join-request/community-join-request.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [MongooseModule.forFeature([{ name: Community.name, schema: CommunitySchema }]),  forwardRef(() => CommunityJoinRequestModule),
  ClientsModule.register([
    {
      name: 'NATS_SERVICE',
      transport: Transport.NATS,
      options: {
        servers: ['nats://nats:4222'],
      },
    },
  ]),
  ],
  
  controllers: [CommunityController],
  providers: [CommunityService],
  exports: [CommunityService]
})
export class CommunityModule {}
