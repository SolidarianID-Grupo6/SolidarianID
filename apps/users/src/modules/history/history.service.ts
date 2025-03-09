import {
  CreateCauseStatsDto,
  CreateCommunityEventDto,
} from 'libs/events/dto/create-community-dto';
import { CommunityEvent } from 'libs/events/enums/community.events.enum';
import { CommunityUserAddedDto } from 'libs/events/dto/community-user-added.dto';
import { SupportEventDto } from 'libs/events/dto/support-event.dto';
import { CreateActionStatsDto } from 'libs/events/dto/create-action-dto';
import { DonateEventDto } from 'libs/events/dto/donate-event-dto';
import { Either } from 'libs/base/logic/Result';
import { UserNotFoundError } from '../../errors/UserNotFoundError';
import * as Domain from './domain';

export interface HistoryService {
  getHistory(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<Either<UserNotFoundError, Domain.History[]>>;

  registerCommunityCreation(
    event: CommunityEvent,
    dto: CreateCommunityEventDto,
  ): Promise<void>;

  registerCommunityMembership(
    event: CommunityEvent,
    dto: CommunityUserAddedDto,
  ): Promise<void>;

  registerCauseParticipation(event: CommunityEvent, dto: SupportEventDto): Promise<void>;

  registerSupport(event: CommunityEvent, dto: SupportEventDto): Promise<void>;

  registerCauseCreation(event: CommunityEvent, dto: CreateCauseStatsDto): Promise<void>;

  registerActionCreation(event: CommunityEvent, dto: CreateActionStatsDto): Promise<void>;

  registerDonation(event: CommunityEvent, dto: DonateEventDto): Promise<void>;
}
