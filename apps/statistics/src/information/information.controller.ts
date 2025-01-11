import { Controller, Get, Param } from '@nestjs/common';
import { InformationService } from './information.service';
import {
  Client,
  ClientProxy,
  EventPattern,
  Payload,
  Transport,
} from '@nestjs/microservices';
import { CommunityEvent } from 'libs/events/enums/community.events.enum';
import { CreateCommunityEventDto } from 'libs/events/dto/create-community-dto';
import { SupportEventDto } from 'libs/events/dto/support-event.dto';
import { CreateCauseStatsDto } from 'libs/events/dto/create-cause-dto';
import { CreateActionStatsDto } from 'libs/events/dto/create-action-dto';
import { DonateEventDto } from 'libs/events/dto/donate-event-dto';

@Controller('/information')
export class InformationController {
  constructor(private readonly informationService: InformationService) {}

  @Client({
    transport: Transport.NATS,
    options: {
      servers: ['nats://nats:4222'],
    },
  })
  client: ClientProxy;

  @Get()
  async getInformation() {
    return this.informationService.getAll();
  }

  @Get('/getOdsByComunidad/:idComunidad')
  async getOdsByComunidad(@Param('idComunidad') idComunidad: string) {
    return this.informationService.getOdsByComunidad(idComunidad);
  }

  @EventPattern(CommunityEvent.CreateCommunity)
  async handleCreateCommunity(@Payload() data: CreateCommunityEventDto) {
    return this.informationService.createInformation(data);
  }

  @EventPattern(CommunityEvent.NewCommunityUser)
  async handleCreateNewUserCommunity(data: string) {
    return this.informationService.newUserCommunity(data);
  }

  @EventPattern(CommunityEvent.NewSupport)
  async handleCreateNewSupport(data: SupportEventDto) {
    return this.informationService.newUserSupport(data);
  }

  @EventPattern(CommunityEvent.CreateCause)
  async handleCreateNewCause(data:  CreateCauseStatsDto) {
    return this.informationService.createCause(data);
  }

  @EventPattern(CommunityEvent.CreateAction)
  async handleCreateNewAction(data:  CreateActionStatsDto) {
    return this.informationService.createAction(data);
  }

  @EventPattern(CommunityEvent.DonateEvent)
  async handleCreateDonate(data:  DonateEventDto) {
    return this.informationService.donateorVolunteer(data);
  }
}
