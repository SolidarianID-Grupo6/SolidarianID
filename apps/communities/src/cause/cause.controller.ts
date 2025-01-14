import { Controller, Get, Post, Put, Body, Param, Delete } from '@nestjs/common';
import { CauseService } from './cause.service';
import { CreateCauseDto } from './dto/create-cause.dto';
import { UpdateCauseDto } from './dto/update-cause.dto';
import { CauseEntity } from './entities/cause.entity';
import { AuthType } from '@app/iam/authentication/enums/auth-type.enum';
import { Auth } from '@app/iam/authentication/decorators/auth.decorator';
import { ActiveUser } from '@app/iam/decorators/active-user.decorator';
import { IActiveUserData } from '@app/iam/interfaces/active-user-data.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Causes')
@Controller('causes/')
export class CauseController {
  constructor(private readonly causeService: CauseService) { }

  @ApiOperation({ summary: 'Create a cause' })
  @Auth(AuthType.None)
  @Post(":idCommunity")
  async create(@Param('idCommunity') idCommunity: string, @Body() createCauseDto: CreateCauseDto, @ActiveUser() user: IActiveUserData): Promise<string> {
    return this.causeService.create(idCommunity, createCauseDto, user.sub);
  }

  @ApiOperation({ summary: 'Get all causes' })
  @Auth(AuthType.None)
  @Get()
  async findAll(): Promise<CauseEntity[]> {
    return this.causeService.findAll();
  }

  @ApiOperation({ summary: 'Get a cause by id' })
  @Auth(AuthType.None)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CauseEntity> {
    return this.causeService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a cause by id' })
  @Auth(AuthType.None)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCauseDto: UpdateCauseDto,
  ): Promise<void> {
    await this.causeService.update(id, updateCauseDto);
  }

  @ApiOperation({ summary: 'Support a cause' })
  @Auth(AuthType.None)
  @Put('supports/:id')
  async supportUserRegistered(@Param('id') id: string,
    @ActiveUser() user: IActiveUserData): Promise<void> {
    await this.causeService.supportUserRegistered(id, user.sub);
  }

  @ApiOperation({ summary: 'Delete a cause by id' })
  @Auth(AuthType.None)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.causeService.remove(id);
  }
}
