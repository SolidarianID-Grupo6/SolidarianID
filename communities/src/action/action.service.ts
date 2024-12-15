import { Injectable, NotFoundException, BadRequestException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { Action, ActionDocument } from './schemas/action.schema';

@Injectable()
export class ActionService {
  constructor(
    @InjectModel(Action.name) private readonly actionModel: Model<ActionDocument>,
  ) {}
  
  // Crear una nueva accion
  async create(createActionDto: CreateActionDto): Promise<Action> {
    const newAction = new this.actionModel(createActionDto);
    return newAction.save();
  }

  // Obtener todas las acciones
  async findAll(): Promise<Action[]> {
    return this.actionModel.find().exec(); 
  }

  // Obtener una accion por ID
  async findOne(id: string): Promise<Action> {
    const action = this.actionModel.findById(id).exec();
    if (!action) {
      throw new NotFoundException(`Action with ID "${id}" not found`);
    }
    return action;
  }

  // Actualizar una accion por ID
  async update(id: string, updateActionDto: UpdateActionDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: "${id}"`);
    }
    const updatedAction = await this.actionModel
      .findByIdAndUpdate(id, updateActionDto, { new: true, runValidators: true }) 
      .exec();

      if(!updatedAction){
        throw new NotFoundException(`Action with ID "${id}" not found`);
      }

      return updatedAction
  }

  // Eliminar una accion por ID
  async remove(id: string): Promise<void> {
    const action = await this.actionModel.findByIdAndDelete(id).exec();
    if(!action){
      throw new NotFoundException(`Action with ID "${id}" not found`);
    }
  }
}
