import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { StatisticsService } from './statistics.service';
import { CommunityEvent } from 'libs/events/enums/community.events.enum';

@Controller('/statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @EventPattern(CommunityEvent.CommunitiesByODS)
  async handleCommunitiesByODS(@Payload() data: any) {
    return this.statisticsService.getCommunitiesByODS(data);
  }

  @EventPattern(CommunityEvent.CausesByODS)
  async handleCausesByODS(@Payload() data: any) {
    return this.statisticsService.getCausesByODS(data);
  }

  @EventPattern(CommunityEvent.SupportByODS)
  async handleSupportByODS(@Payload() data: any) {
    return this.statisticsService.getSupportByODS(data);
  }

  @EventPattern(CommunityEvent.SupportByCommunity)
  async handleSupportByCommunity(@Payload() data: any) {
    return this.statisticsService.getSupportByCommunity(data);
  }

  @EventPattern(CommunityEvent.ActionsByCommunity)
  async handleActionsByCommunity(@Payload() data: any) {
    return this.statisticsService.getActionsByCommunity(data);
  }
}
