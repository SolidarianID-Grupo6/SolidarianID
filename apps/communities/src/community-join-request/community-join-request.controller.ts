import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { CommunityJoinRequestService } from './community-join-request.service';
import { UserRequestDto } from './dto/user-request.dto';


@Controller('community-join-request')
export class CommunityJoinRequestController {
  constructor(private readonly communityJoinRequestService: CommunityJoinRequestService) {}

  @Get()
  async findAll(): Promise<CommunityJoinRequest[]> {
    return this.communityJoinRequestService.findAll();
  }

  @Post('requests/:idCommunity')
  async requestJoin(@Param('idCommunity') idCommunity: string, @Body() userRequestDto: UserRequestDto): Promise<void> {
    await this.communityJoinRequestService.requestJoin(userRequestDto);
  }

  @Post('acceptances/:id')
  async acceptRequest(@Param('id') id: string, @Body() userRequestDto: UserRequestDto): Promise<void> {
    await this.communityJoinRequestService.acceptRequest(id, userRequestDto);
  }

  @Post('rejections/:id')
  async rejectRequest(@Param('id') id: string, @Body() userRequestDto: UserRequestDto): Promise<void> {
    await this.communityJoinRequestService.rejectRequest(id, userRequestDto);
  }
}