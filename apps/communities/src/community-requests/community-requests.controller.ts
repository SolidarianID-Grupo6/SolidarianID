import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { CommunityRequestsService } from './community-requests.service';
import { CreateCommunityRequestsDto } from './dto/create-community-request.dto';
import { CommunityRequestsEntity } from './entities/community-request.entity';
import { AuthType } from '@app/iam/authentication/enums/auth-type.enum';
import { Auth } from '@app/iam/authentication/decorators/auth.decorator';
import { ActiveUser } from '@app/iam/decorators/active-user.decorator';
import { IActiveUserData } from '@app/iam/interfaces/active-user-data.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Community Requests')
@Controller('community-requests/')
export class CommunityRequestsController {
  constructor(private readonly requestService: CommunityRequestsService) { }

  @ApiOperation({ summary: 'Create a community request' })
  @Auth(AuthType.None)
  @Post()
  async createRequest(
    @Body() createRequestDto: CreateCommunityRequestsDto, @ActiveUser() user: IActiveUserData
  ): Promise<string> {
    return this.requestService.createRequest(createRequestDto, user.sub);
  }

  @ApiOperation({ summary: 'Get all community requests' })
  @Auth(AuthType.None)
  @Get()
  async findAllPending(): Promise<CommunityRequestsEntity[]> {
    return this.requestService.findAllPending();
  }

  @ApiOperation({ summary: 'Get a community request by id' })
  @Auth(AuthType.None)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CommunityRequestsEntity> {
    return this.requestService.findOne(id);
  }

  @ApiOperation({ summary: 'Approve a community request by id' })
  @Auth(AuthType.None)
  @Put('approve/:id')
  async approveRequest(@Param('id') id: string, @ActiveUser() user: IActiveUserData): Promise<string> {
    return this.requestService.approveRequest(id);
  }

  @ApiOperation({ summary: 'Reject a community request by id' })
  @Auth(AuthType.None)
  @Put('reject/:id')
  async rejectRequest(@Param('id') id: string): Promise<void> {
    return this.requestService.rejectRequest(id);
  }
}
