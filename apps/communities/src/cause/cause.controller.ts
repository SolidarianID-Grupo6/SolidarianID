import { Controller, Get, Post, Put, Body, Param, Delete } from '@nestjs/common';
import { CauseService } from './cause.service';
import { Cause } from './schemas/cause.schema';
import { CreateCauseDto } from './dto/create-cause.dto';
import { UpdateCauseDto } from './dto/update-cause.dto';
import { SupportUserAnonymousDto } from './dto/supportUserAnonymous-cause.dto';
import { SupportUserRegisteredDto } from './dto/supportUserRegistered-cause.dto';

@Controller('causes')
export class CauseController {
  constructor(private readonly causeService: CauseService) {}

  @Post()
  async create(@Body() createCauseDto: CreateCauseDto): Promise<Cause> {
    return this.causeService.create(createCauseDto);
  }

  @Get()
  async findAll(): Promise<Cause[]> {
    return this.causeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Cause> {
    return this.causeService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateCauseDto: UpdateCauseDto,
  ): Promise<Cause> {
    return this.causeService.update(id, updateCauseDto);
  }

  @Put('support-anonymous/:id')
  async supportUserAnonymous( @Param('id') id: string, @Body() supportUserAnonymousDto: SupportUserAnonymousDto,
  ): Promise<Cause> {
    return this.causeService.supportUserAnonymous(id, supportUserAnonymousDto);
  }

  @Put('support-registered/:id')
  async supportUserRegistered( @Param('id') id: string, @Body() supportUserRegisteredDto: SupportUserRegisteredDto,
  ): Promise<Cause> {
    return this.causeService.supportUserRegistered(id, supportUserRegisteredDto);
  }


  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.causeService.remove(id);
  }
}
