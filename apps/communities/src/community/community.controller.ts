import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { CommunityService } from './community.service';
import { Community } from './schemas/community.schema';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { EventPattern } from '@nestjs/microservices';

@Controller('communities/')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @EventPattern('create-community')
  async create(createCommunityDto: CreateCommunityDto): Promise<Community> {
    return this.communityService.create(createCommunityDto);
  }

  @Get()
  async findAll(): Promise<Community[]> {
    return this.communityService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Community> {
    return this.communityService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommunityDto: UpdateCommunityDto,
  ): Promise<Community> {
    return this.communityService.update(id, updateCommunityDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.communityService.remove(id);
  }

}
