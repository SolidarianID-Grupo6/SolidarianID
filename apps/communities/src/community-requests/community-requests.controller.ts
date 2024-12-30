import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { CommunityRequestsService } from './community-requests.service';
import { CreateCommunityRequestsDto } from './dto/create-community-request.dto';
import { CommunityRequestsEntity } from './entities/community-request.entity';

@Controller('community-requests')
export class CommunityRequestsController {
  constructor(private readonly requestService: CommunityRequestsService) {}

  @Post()
  async createRequest(@Body() createRequestDto: CreateCommunityRequestsDto): Promise<string> {
    return this.requestService.createRequest(createRequestDto);
  }

  @Get()
  async findAllPending(): Promise<CommunityRequestsEntity[]> {
    return this.requestService.findAllPending();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CommunityRequestsEntity> {
    return this.requestService.findOne(id);
  }

  @Put('approve/:id')
  async approveRequest(@Param('id') id: string): Promise<string> {
    return this.requestService.approveRequest(id);
  }

  @Put('reject/:id')
  async rejectRequest(@Param('id') id: string, @Body('rejectReason') rejectReason: string): Promise<void> {
    return this.requestService.rejectRequest(id, rejectReason);
  }
}