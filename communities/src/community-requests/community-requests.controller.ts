import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { CommunityRequestsService } from './community-requests.service';
import { CreateCommunityRequestsDto } from './dto/create-community-request.dto';
import { CommunityRequests } from './schemas/community-requests.schema';

@Controller('community-requests')
export class CommunityRequestsController {
  constructor(private readonly requestService: CommunityRequestsService) {}

  @Post()
  async createRequest(@Body() createRequestDto: CreateCommunityRequestsDto) {
    return this.requestService.createRequest(createRequestDto);
  }

  @Get()
  async findAllPending() {
    return this.requestService.findAllPending();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CommunityRequests> {
    return this.requestService.findOne(id);
  }

  @Put(':id/approve')
  async approveRequest(@Param('id') id: string) {
    return this.requestService.approveRequest(id);
  }

  @Put(':id/reject')
  async rejectRequest(@Param('id') id: string) {
    return this.requestService.rejectRequest(id);
  }
}
