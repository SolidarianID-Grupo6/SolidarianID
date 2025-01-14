import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { Action, ActionSchema } from './schemas/action.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CommunityModule } from '../community/community.module';
import { CauseModule } from '../cause/cause.module';

@Module({
imports: [
    MongooseModule.forFeature([{ name: Action.name, schema: ActionSchema }]),
    ClientsModule.register([
    {
        name: 'NATS_SERVICE',
        transport: Transport.NATS,
        options: {
        servers: ['nats://nats:4222'],
        },
    },
    ]),
    forwardRef(() => CommunityModule),
    forwardRef(() => CauseModule),
],
  controllers: [ActionController],
  providers: [ActionService],
})
export class ActionModule {}
