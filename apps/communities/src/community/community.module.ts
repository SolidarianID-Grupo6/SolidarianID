import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { Community, CommunitySchema } from './schemas/community.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CauseModule } from '../cause/cause.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Community.name, schema: CommunitySchema }]),
    forwardRef(() => CauseModule),
    ClientsModule.register([{
      name: 'NATS_SERVICE',
      transport: Transport.NATS,
      options: {
        servers: ['nats://nats:4222'],
      },
    }])
  ],
  controllers: [CommunityController],
  providers: [CommunityService],
  exports: [CommunityService]
})
export class CommunityModule {}
