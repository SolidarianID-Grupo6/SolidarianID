import { Controller, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { CommunityService } from './community.service';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { CommunityEntity } from './entities/community.entity';
import { Auth } from '@app/iam/authentication/decorators/auth.decorator';
import { AuthType } from '@app/iam/authentication/enums/auth-type.enum';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Communities')
@Controller('communities')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) { }

  @ApiOperation({ summary: 'Get all communities' })
  @Auth(AuthType.None)
  @Get()
  async findAll(): Promise<CommunityEntity[]> {
    return this.communityService.findAll();
  }

  @ApiOperation({ summary: 'Get a community by id' })
  @Auth(AuthType.None)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CommunityEntity> {
    return this.communityService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a community by id' })
  @Auth(AuthType.None)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCommunityDto: UpdateCommunityDto) {
    await this.communityService.update(id, updateCommunityDto);
  }

  @ApiOperation({ summary: 'Delete a community by id' })
  @Auth(AuthType.None)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.communityService.remove(id);
  }

}
