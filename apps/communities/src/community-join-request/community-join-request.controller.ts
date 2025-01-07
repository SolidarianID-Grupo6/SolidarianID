import { Controller, Post, Body, Param, Get, Put } from '@nestjs/common';
import { CommunityJoinRequestService } from './community-join-request.service';
import { CommunityJoinRequestEntity } from './entities/community-join-request.entity';
import { UserJoinRequestDto } from './dto/user-join-request.dto';


@Controller('community-join-request/')
export class CommunityJoinRequestController {
  constructor(private readonly communityJoinRequestService: CommunityJoinRequestService) {}

  @Get()
  async findAll(): Promise<CommunityJoinRequestEntity[]> {
    return this.communityJoinRequestService.findAll();
  }

  @Get(':idCommunity')
  async findByCommunitYPending(@Param('idCommunity') idCommunity: string): Promise<CommunityJoinRequestEntity[]> {
    return this.communityJoinRequestService.findPendingRequestsByCommunity(idCommunity);
  }


  @Post('requests')
  async requestJoin(@Body() userJoinRequest: UserJoinRequestDto): Promise<string> {
    return this.communityJoinRequestService.requestJoin(userJoinRequest);
  }

  @Put('acceptances/:idRequest')
  async acceptRequest(@Param('idRequest') idRequest: string): Promise<void> {
    await this.communityJoinRequestService.acceptRequest(idRequest);
  }

  @Put('rejections/:idRequest')
  async rejectRequest(@Param('idRequest') idRequest: string): Promise<void> {
    await this.communityJoinRequestService.rejectRequest(idRequest);
  }
}