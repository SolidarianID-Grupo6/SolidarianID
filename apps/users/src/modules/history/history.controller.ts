import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { Response } from 'express';
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
import { ApiOperation } from '@nestjs/swagger';

@Controller('history')
export class HistoryController {
  public constructor(
    @Inject('HistoryService')
    private readonly historyService: HistoryService,
  ) {}

  @ApiOperation({ summary: 'Get your user history' })
  @Get()
  async getHistory(
    @Res({ passthrough: true }) response: Response,
    @Query() paginationQuery,
    @ActiveUser() user: IActiveUserData,
  ) {
    const { limit, offset } = paginationQuery;
    const result = await this.historyService.getHistory(
      user.sub,
      limit,
      offset,
    );

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }

    if (!result.value || result.value.length === 0) {
      throw new HttpException('No user history', HttpStatus.NO_CONTENT);
    }

    return result.value;
  }

  @ApiOperation({
    summary: 'Get history of a given us by id (only for admins)',
  })
  @Roles(Role.Admin)
  @Get(':id')
  async getHistoryById(
    @Res({ passthrough: true }) response: Response,
    @Param('id') id: string,
    @Query() paginationQuery,
  ) {
    const { limit, offset } = paginationQuery;
    const result = await this.historyService.getHistory(id, limit, offset);

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message);
    }

    if (!result.value || result.value.length === 0) {
      throw new HttpException('No user history', HttpStatus.NO_CONTENT);
    }

    return result.value;
  }

  @EventPattern(CommunityEvent.CreateCommunity)
  registerCommunityCreation(createCommunityEventDto: CreateCommunityEventDto) {
    this.historyService.registerCommunityCreation(
      CommunityEvent.CreateCommunity,
      createCommunityEventDto,
    );
  }

  @EventPattern(CommunityEvent.NewCommunityUser)
  registerCommunityMembership(communityUserAddedDto: CommunityUserAddedDto) {
    this.historyService.registerCommunityMembership(
      CommunityEvent.NewCommunityUser,
      communityUserAddedDto,
    );
  }

  @EventPattern(CommunityEvent.NewCause)
  registerCauseParticipation(supportEventDto: SupportEventDto) {
    this.historyService.registerCauseParticipation(
      CommunityEvent.NewCause,
      supportEventDto,
    );
  }

  @EventPattern(CommunityEvent.NewSupport)
  registerSupport(supportEventDto: SupportEventDto) {
    this.historyService.registerSupport(
      CommunityEvent.NewSupport,
      supportEventDto,
    );
  }

  @EventPattern(CommunityEvent.CreateCause)
  registerCauseCreation(createCauseDto: CreateCauseStatsDto) {
    this.historyService.registerCauseCreation(
      CommunityEvent.CreateCause,
      createCauseDto,
    );
  }

  @EventPattern(CommunityEvent.CreateAction)
  registerActionCreation(createActionDto: CreateActionStatsDto) {
    this.historyService.registerActionCreation(
      CommunityEvent.CreateAction,
      createActionDto,
    );
  }

  @EventPattern(CommunityEvent.DonateEvent)
  registerDonation(donateEventDto: DonateEventDto) {
    this.historyService.registerDonation(
      CommunityEvent.DonateEvent,
      donateEventDto,
    );
  }
}
