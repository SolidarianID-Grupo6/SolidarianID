import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { CommunityJoinRequestService } from './community-join-request.service';
import { UserRequestDto } from './dto/user-request.dto';
import { CommunityJoinRequest } from './schemas/community-join-request.schema';


@Controller('community-join-request')
export class CommunityJoinRequestController {
  constructor(private readonly communityJoinRequestService: CommunityJoinRequestService) {}

  @Get()
  async findAll(): Promise<CommunityJoinRequest[]> {
    return this.communityJoinRequestService.findAll();
  }

  @Post('requests/:id')
  async requestJoin(@Param('id') id: string, @Body() userRequestDto: UserRequestDto): Promise<CommunityJoinRequest> {
    return this.communityJoinRequestService.requestJoin(id, userRequestDto);
  }

  @Post('acceptances/:id')
  async acceptRequest(@Param('id') id: string, @Body() userRequestDto: UserRequestDto): Promise<CommunityJoinRequest> {
    return this.communityJoinRequestService.acceptRequest(id, userRequestDto);
  }

  @Post('rejections/:id')
  async rejectRequest(@Param('id') id: string, @Body() userRequestDto: UserRequestDto): Promise<CommunityJoinRequest> {
    return this.communityJoinRequestService.rejectRequest(id, userRequestDto);
  }
}