import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './entities/history.entity';
import { User } from '../entities/user.entity';
import {
  CreateCauseStatsDto,
  CreateCommunityEventDto,
} from 'libs/events/dto/create-community-dto';
import { CommunityEvent } from 'libs/events/enums/community.events.enum';
import { CommunityUserAddedDto } from 'libs/events/dto/community-user-added.dto';
import { SupportEventDto } from 'libs/events/dto/support-event.dto';
import { CreateActionStatsDto } from 'libs/events/dto/create-action-dto';
import { DonateEventDto } from 'libs/events/dto/donate-event-dto';
import { Result } from './entities/result';

@Injectable()
export class HistoryService {
  public constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async getHistory(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<Result<History[]>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return Result.fail<History[]>(`User with ID ${userId} not found`);
    }

    return Result.ok<History[]>(
      await this.historyRepository.find({
        where: { user: user },
        take: limit,
        skip: offset,
      }),
    );
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
  ): Promise<Result<History>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return Result.fail<History>(`User with ID ${userId} not found`);
    }

    const history = this.historyRepository.create({
      action: event,
      user,
      data: dto,
      eventDate: new Date(),
    });

    return Result.ok<History>(await this.historyRepository.save(history));
  }
}
