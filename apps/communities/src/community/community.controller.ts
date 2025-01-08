import { Controller, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { CommunityService } from './community.service';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { CommunityEntity } from './entities/community.entity';
import { Auth } from '@app/iam/authentication/decorators/auth.decorator';
import { AuthType } from '@app/iam/authentication/enums/auth-type.enum';


@Controller('communities/')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Auth(AuthType.None)
  @Get()
  async findAll(): Promise<CommunityEntity[]> {
    return this.communityService.findAll();
  }

  @Auth(AuthType.None)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CommunityEntity> {
    return this.communityService.findOne(id);
  }

  @Auth(AuthType.None)
  @Put(':id')
  async update( @Param('id') id: string, @Body() updateCommunityDto: UpdateCommunityDto) {
    await this.communityService.update(id, updateCommunityDto);
  }

  @Auth(AuthType.None)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.communityService.remove(id);
  }

}
