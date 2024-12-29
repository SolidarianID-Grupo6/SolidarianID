import { Controller, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { CommunityService } from './community.service';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { CommunityEntity } from './entities/community.entity';

@Controller('communities/')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get()
  async findAll(): Promise<CommunityEntity[]> {
    return this.communityService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CommunityEntity> {
    return this.communityService.findOne(id);
  }

  @Put(':id')
  async update( @Param('id') id: string, @Body() updateCommunityDto: UpdateCommunityDto) {
    await this.communityService.update(id, updateCommunityDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.communityService.remove(id);
  }

}
