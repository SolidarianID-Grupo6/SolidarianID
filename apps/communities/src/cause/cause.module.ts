import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CauseService } from './cause.service';
import { CauseController } from './cause.controller';
import { Cause, CauseSchema } from './schemas/cause.schema';
import { CommunityModule } from '../community/community.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cause.name, schema: CauseSchema }]), CommunityModule,
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
  controllers: [CauseController],
  providers: [CauseService],
})
export class CauseModule {}
