import { Inject, Injectable } from '@nestjs/common';
import {
  CreateCauseStatsDto,
  CreateCommunityEventDto,
} from 'libs/events/dto/create-community-dto';
import { CommunityEvent } from 'libs/events/enums/community.events.enum';
import { CommunityUserAddedDto } from 'libs/events/dto/community-user-added.dto';
import { SupportEventDto } from 'libs/events/dto/support-event.dto';
import { CreateActionStatsDto } from 'libs/events/dto/create-action-dto';
import { DonateEventDto } from 'libs/events/dto/donate-event-dto';
import { HistoryRepo } from './history.repository';
import { Either } from 'libs/base/logic/Result';
import { UserNotFoundError } from './errors/UserNotFoundError';
import * as Domain from './domain';
import { HistoryService } from './history.service';

@Injectable()
export class HistoryServiceImpl implements HistoryService {
  public constructor(
    @Inject('HistoryRepo') private readonly historyRepo: HistoryRepo,
  ) {}

  public async getHistory(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<Either<UserNotFoundError, Domain.History[]>> {
    return this.historyRepo.findAll(userId, limit, offset);
  }

  public registerCommunityCreation(
    event: CommunityEvent,
    dto: CreateCommunityEventDto,
  ) {
    return this.registerHistoryRecord(event, dto.user, dto);
  }

  public registerCommunityMembership(
    event: CommunityEvent,
    dto: CommunityUserAddedDto,
  ) {
    return this.registerHistoryRecord(event, dto.userId, dto);
  }

  public registerCauseParticipation(
    event: CommunityEvent,
    dto: SupportEventDto,
  ) {
    return this.registerHistoryRecord(event, dto.user, dto);
  }

  public registerSupport(event: CommunityEvent, dto: SupportEventDto) {
    return this.registerHistoryRecord(event, dto.user, dto);
  }

  public registerCauseCreation(
    event: CommunityEvent,
    dto: CreateCauseStatsDto,
  ) {
    return this.registerHistoryRecord(event, dto.userId, dto);
  }

  public registerActionCreation(
    event: CommunityEvent,
    dto: CreateActionStatsDto,
  ) {
    return this.registerHistoryRecord(event, dto.user, dto);
  }

  public registerDonation(event: CommunityEvent, dto: DonateEventDto) {
    return this.registerHistoryRecord(event, dto.user, dto);
  }

  private async registerHistoryRecord(
    event: CommunityEvent,
    userId: string,
    dto: any,
  ): Promise<Either<UserNotFoundError, Domain.History>> {
    return this.historyRepo.registerHistoryRecord(event, userId, dto);
  }
}
