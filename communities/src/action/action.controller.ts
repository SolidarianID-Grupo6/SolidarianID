import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ActionService } from './action.service';
import { Action } from './schemas/action.schema';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Controller('actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Post()
  async create(@Body() createActionDto: CreateActionDto): Promise<Action> {
    return this.actionService.create(createActionDto);
  }

  @Get()
  async findAll(): Promise<Action[]> {
    return this.actionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Action> {
    return this.actionService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateActionDto: UpdateActionDto): Promise<Action> {
    return this.actionService.update(id, updateActionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.actionService.remove(id);
  }
}
