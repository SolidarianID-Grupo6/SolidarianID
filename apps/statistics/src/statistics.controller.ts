import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import {
  Client,
  ClientProxy,
  EventPattern,
  Transport,
} from '@nestjs/microservices';
import { CommunityEvent } from 'libs/events/enums/community.events.enum';
import { CommunityUserAddedDto } from 'libs/events/dto/community-user-added.dto';

@Controller()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Client({
    transport: Transport.NATS,
    options: {
      servers: ['nats://nats:4222'],
    },
  })
  client: ClientProxy;

  @Get('test-event')
  async testEvent() {
    let payload: CommunityUserAddedDto = {
      userId: '885ef31d-48c3-4809-bd23-9b2f664881e5',
      communityId: '885ef31d-48c3-4809-bd23-9b2f664881e5',
    };

    this.client.emit(CommunityEvent.NewCommunityUser, payload);
    console.log('Event sent');
    return 'Event sent';
  }

  @EventPattern(CommunityEvent.NewCommunityUser)
  async handleEvent(data: CommunityUserAddedDto) {
    console.log('Event received');
    console.log(data);
  }
}
