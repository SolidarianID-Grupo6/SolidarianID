import { Controller, Get, Post, Put, Body, Param, Delete } from '@nestjs/common';
import { CauseService } from './cause.service';
import { Cause } from './schemas/cause.schema';
import { CreateCauseDto } from './dto/create-cause.dto';
import { UpdateCauseDto } from './dto/update-cause.dto';
import { SupportUserRegisteredDto } from './dto/supportUserRegistered-cause.dto';
import { CauseEntity } from './entities/cause.entity';

@Controller('causes/')
export class CauseController {
  constructor(private readonly causeService: CauseService) {}

  @Post(":idCommunity")
  async create(@Param('idCommunity') idCommunity: string, @Body() createCauseDto: CreateCauseDto): Promise<string> {
    return this.causeService.create(idCommunity, createCauseDto);
  }

  @Get()
  async findAll(): Promise<CauseEntity[]> {
    return this.causeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CauseEntity> {
    return this.causeService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateCauseDto: UpdateCauseDto,
  ): Promise<void> {
    await this.causeService.update(id, updateCauseDto);
  }

  @Put('supports/:id')
  async supportUserRegistered( @Param('id') id: string, @Body() supportUserRegisteredDto: SupportUserRegisteredDto,
  ): Promise<void> {
    await this.causeService.supportUserRegistered(id, supportUserRegisteredDto);
  }


  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.causeService.remove(id);
  }
}
