import { Controller, Get, Post, Put, Body, Param, Delete } from '@nestjs/common';
import { CauseService } from './cause.service';
import { Cause } from './schemas/cause.schema';
import { CreateCauseDto } from './dto/create-cause.dto';
import { UpdateCauseDto } from './dto/update-cause.dto';

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

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.causeService.remove(id);
  }
}
