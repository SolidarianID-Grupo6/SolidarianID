import { Controller, Post, Body, Get } from '@nestjs/common';
import { CommunityService } from './community.service';
import { Community } from './schemas/community.schema';

@Controller('communities')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post()
  async create(@Body() createCommunityDto: Partial<Community>): Promise<Community> {
    return this.communityService.create(createCommunityDto);
  }

  @Get()
  async findAll(): Promise<Community[]> {
    return this.communityService.findAll();
  }
}
