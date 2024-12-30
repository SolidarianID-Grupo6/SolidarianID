import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ActionService } from './action.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { DonateActionDto } from './dto/donate-action.dto';
import { VolunteerActionDto } from './dto/volunteer-action.dto';
import { ActionEntity } from './entities/action.entity';

@Controller('actions/')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Post()
  async create(@Body() createActionDto: CreateActionDto): Promise<string> {
    return this.actionService.create(createActionDto);
  }

  @Get()
  async findAll(): Promise<ActionEntity[]> {
    return this.actionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ActionEntity> {
    return this.actionService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateActionDto: UpdateActionDto): Promise<void> {
    return this.actionService.update(id, updateActionDto);
  }

  @Put('donations/:id')
  async donate(@Param('id') id: string, @Body() donateActionDto: DonateActionDto): Promise<void> {
    await this.actionService.donate(id, donateActionDto);
  }

  @Put('volunteers/:id')
  async volunteer(@Param('id') id: string, @Body() volunteerAction: VolunteerActionDto): Promise<void> {
    await this.actionService.volunteer(id, volunteerAction);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.actionService.remove(id);
  }
}
