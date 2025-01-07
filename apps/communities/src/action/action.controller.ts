import { Controller, Get, Post, Body, Put, Param, Delete, BadRequestException } from '@nestjs/common';
import { ActionService } from './action.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { DonateActionDto } from './dto/donate-action.dto';
import { VolunteerActionDto } from './dto/volunteer-action.dto';
import { ActionEntity } from './entities/action.entity';
import { Auth } from '@app/iam/authentication/decorators/auth.decorator';
import { AuthType } from '@app/iam/authentication/enums/auth-type.enum';

@Controller('actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  // Crear una nueva acción
  @Auth(AuthType.None)
  @Post()
  async createAction(@Body() createActionDto: CreateActionDto): Promise<string> {
    return this.actionService.createAction(createActionDto);
  }

  // Obtener todas las acciones
  @Auth(AuthType.None)
  @Get()
  async findAll(): Promise<ActionEntity[]> {
    return this.actionService.findAll();
  }

  // Obtener una acción por ID
  @Auth(AuthType.None)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ActionEntity> {
    return this.actionService.findOne(id);
  }

  // Actualizar una acción por ID
  @Auth(AuthType.None)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateActionDto: UpdateActionDto,
  ): Promise<void> {
    return this.actionService.update(id, updateActionDto);
  }

  // Donar a una acción
  @Auth(AuthType.None)
  @Post(':id/donate')
  async donate(
    @Param('id') id: string,
    @Body() donateActionDto: DonateActionDto,
  ): Promise<ActionEntity> {
    return this.actionService.donate(id, donateActionDto);
  }

  // Voluntariar en una acción
  @Auth(AuthType.None)
  @Post(':id/volunteer')
  async volunteer(
    @Param('id') id: string,
    @Body() volunteerActionDto: VolunteerActionDto,
  ): Promise<void> {
    if (!volunteerActionDto.user) {
      throw new BadRequestException('User ID is required');
    }
    return this.actionService.volunteer(id, volunteerActionDto);
  }

  // Eliminar una acción por ID
  @Auth(AuthType.None)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.actionService.remove(id);
  }
}
