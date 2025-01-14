import { Controller, Get, Param, Query } from '@nestjs/common';
import { HistoryService } from './history.service';
import { EventPattern } from '@nestjs/microservices';
import { CommunityEvent } from 'libs/events/enums/community.events.enum';
import {
  CreateCauseStatsDto,
  CreateCommunityEventDto,
} from 'libs/events/dto/create-community-dto';
import { CommunityUserAddedDto } from 'libs/events/dto/community-user-added.dto';
import { SupportEventDto } from 'libs/events/dto/support-event.dto';
import { CreateActionStatsDto } from 'libs/events/dto/create-action-dto';
import { DonateEventDto } from 'libs/events/dto/donate-event-dto';
import { ActiveUser } from '@app/iam/decorators/active-user.decorator';
import { IActiveUserData } from '@app/iam/interfaces/active-user-data.interface';
import { Roles } from '@app/iam/authorization/decorators/roles.decorator';
import { Role } from '@app/iam/authorization/enums/role.enum';

@Controller('history')
export class HistoryController {
  public constructor(private readonly historyService: HistoryService) {}

  @Get()
  getHistory(@Query() paginationQuery, @ActiveUser() user: IActiveUserData) {
    const { limit, offset } = paginationQuery;
    return this.historyService.getHistory(user.sub, limit, offset);
  }

  @Roles(Role.Admin)
  @Get(':id')
  getHistoryById(@Param('id') id: string, @Query() paginationQuery) {
    const { limit, offset } = paginationQuery;
    return this.historyService.getHistory(id, limit, offset);
  }

  @EventPattern(CommunityEvent.CreateCommunity)
  registerCommunityCreation(createCommunityEventDto: CreateCommunityEventDto) {
    return this.historyService.registerCommunityCreation(
      CommunityEvent.CreateCommunity,
      createCommunityEventDto,
    );
  }

  @EventPattern(CommunityEvent.NewCommunityUser)
  registerCommunityMembership(communityUserAddedDto: CommunityUserAddedDto) {
    return this.historyService.registerCommunityMembership(
      CommunityEvent.NewCommunityUser,
      communityUserAddedDto,
    );
  }

  @EventPattern(CommunityEvent.NewCause)
  registerCauseParticipation(supportEventDto: SupportEventDto) {
    return this.historyService.registerCauseParticipation(
      CommunityEvent.NewCause,
      supportEventDto,
    );
  }

  @EventPattern(CommunityEvent.NewSupport)
  registerSupport(supportEventDto: SupportEventDto) {
    return this.historyService.registerSupport(
      CommunityEvent.NewSupport,
      supportEventDto,
    );
  }

  @EventPattern(CommunityEvent.CreateCause)
  registerCauseCreation(createCauseDto: CreateCauseStatsDto) {
    return this.historyService.registerCauseCreation(
      CommunityEvent.CreateCause,
      createCauseDto,
    );
  }

  @EventPattern(CommunityEvent.CreateAction)
  registerActionCreation(createActionDto: CreateActionStatsDto) {
    return this.historyService.registerActionCreation(
      CommunityEvent.CreateAction,
      createActionDto,
    );
  }

  @EventPattern(CommunityEvent.DonateEvent)
  registerDonation(donateEventDto: DonateEventDto) {
    return this.historyService.registerDonation(
      CommunityEvent.DonateEvent,
      donateEventDto,
    );
  }
}
