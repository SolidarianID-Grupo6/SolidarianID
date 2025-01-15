import { Controller, Post, Body, Param, Get, Put } from '@nestjs/common';
import { CommunityJoinRequestService } from './community-join-request.service';
import { CommunityJoinRequestEntity } from './entities/community-join-request.entity';
import { UserJoinRequestDto } from './dto/user-join-request.dto';
import { Auth } from '@app/iam/authentication/decorators/auth.decorator';
import { AuthType } from '@app/iam/authentication/enums/auth-type.enum';
import { ActiveUser } from '@app/iam/decorators/active-user.decorator';
import { IActiveUserData } from '@app/iam/interfaces/active-user-data.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Community Join Requests')
@Controller('community-join-request/')
export class CommunityJoinRequestController {
  constructor(private readonly communityJoinRequestService: CommunityJoinRequestService) { }

  @Auth(AuthType.None)
  @Get()
  async findAll(): Promise<CommunityJoinRequestEntity[]> {
    return this.communityJoinRequestService.findAll();
  }

  @ApiOperation({ summary: 'Get all pending requests by community' })
  @Auth(AuthType.None)
  @Get(':idCommunity')
  async findByCommunitYPending(@Param('idCommunity') idCommunity: string): Promise<CommunityJoinRequestEntity[]> {
    return this.communityJoinRequestService.findPendingRequestsByCommunity(idCommunity);
  }

  @Auth(AuthType.None)
  @Post('requests')
  async requestJoin(@Body() userJoinRequest: UserJoinRequestDto, @ActiveUser() user: IActiveUserData): Promise<string> {
    return this.communityJoinRequestService.requestJoin(userJoinRequest, user.sub);
  }

  @Auth(AuthType.None)
  @Put('acceptances/:idRequest')
  async acceptRequest(@Param('idRequest') idRequest: string): Promise<void> {
    await this.communityJoinRequestService.acceptRequest(idRequest);
  }

  @Auth(AuthType.None)
  @Put('rejections/:idRequest')
  async rejectRequest(@Param('idRequest') idRequest: string): Promise<void> {
    await this.communityJoinRequestService.rejectRequest(idRequest);
  }
}
