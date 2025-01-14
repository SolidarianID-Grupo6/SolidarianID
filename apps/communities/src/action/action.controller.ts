import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete
} from '@nestjs/common';
import { ActionService } from './action.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { DonateActionDto } from './dto/donate-action.dto';
import { ActionEntity } from './entities/action.entity';
import { Auth } from '@app/iam/authentication/decorators/auth.decorator';
import { AuthType } from '@app/iam/authentication/enums/auth-type.enum';
import { ActiveUser } from '@app/iam/decorators/active-user.decorator';
import { IActiveUserData } from '@app/iam/interfaces/active-user-data.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Actions')
@Controller('actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) { }

  // Crear una nueva acción
  @ApiOperation({ summary: 'Create an action' })
  @Auth(AuthType.None)
  @Post()
  async createAction(@Body() createActionDto: CreateActionDto, @ActiveUser() user: IActiveUserData): Promise<string> {
    return this.actionService.createAction(createActionDto, user.sub);
  }

  // Obtener todas las acciones
  @ApiOperation({ summary: 'Get all actions' })
  @Auth(AuthType.None)
  @Get()
  async findAll(): Promise<ActionEntity[]> {
    return this.actionService.findAll();
  }

  // Obtener una acción por ID
  @ApiOperation({ summary: 'Get an action by id' })
  @Auth(AuthType.None)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ActionEntity> {
    return this.actionService.findOne(id);
  }

  // Actualizar una acción por ID
  @ApiOperation({ summary: 'Update an action by id' })
  @Auth(AuthType.None)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateActionDto: UpdateActionDto,
  ): Promise<void> {
    return this.actionService.update(id, updateActionDto);
  }

  // Donar a una acción
  @ApiOperation({ summary: 'Donate to an action' })
  @Auth(AuthType.None)
  @Post(':id/donate')
  async donate(
    @Param('id') id: string,
    @Body() donateActionDto: DonateActionDto, @ActiveUser() user: IActiveUserData,
  ): Promise<ActionEntity> {
    return this.actionService.donate(id, donateActionDto, user.sub);
  }

  // Voluntariar en una acción
  @ApiOperation({ summary: 'Volunteer in an action' })
  @Auth(AuthType.None)
  @Post(':id/volunteer')
  async volunteer(
    @Param('id') id: string, @ActiveUser() user: IActiveUserData,
  ): Promise<void> {
    return this.actionService.volunteer(id, user.sub);
  }

  // Eliminar una acción por ID
  @ApiOperation({ summary: 'Delete an action by id' })
  @Auth(AuthType.None)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.actionService.remove(id);
  }
}
