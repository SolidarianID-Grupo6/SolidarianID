import { Injectable, NotFoundException, BadRequestException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { Action, ActionDocument } from './schemas/action.schema';
import { DonateActionDto } from './dto/donate-action.dto';
import { VolunteerActionDto } from './dto/volunteer-action.dto';

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

      return updatedAction;
  }

  async donate(id: string, donateActionDto: DonateActionDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: "${id}"`);
    }

    const action = await this.actionModel.findById(id).exec();
  
    if (!action) {
      throw new NotFoundException(`Action with ID "${id}" not found`);
    }

    const donation = {
      userId: donateActionDto.user,
      amount: donateActionDto.donation
    };

    const newProgress = action.progress + donateActionDto.donation;

    const updatedAction = await this.actionModel.findByIdAndUpdate(
      id,
      {
        $push: { donors: donation },
        progress: newProgress
      },
      { new: true, runValidators: true }
    ).exec();

    return updatedAction;
  }

  async volunteer(id: string, volunteerAction: VolunteerActionDto){
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: "${id}"`);
    }

    const action = await this.actionModel.findById(id).exec();
  
    if (!action) {
      throw new NotFoundException(`Action with ID "${id}" not found`);
    }

    if(action.volunteers.includes(volunteerAction.user)){
      throw new BadRequestException(`User with ID "${volunteerAction.user}" already volunteered`);
    }
    
    const updatedAction = await this.actionModel.findByIdAndUpdate(
      id,
      {
        $push: { volunteers: volunteerAction.user }
      },
      { new: true, runValidators: true }
    ).exec();

    return updatedAction;
  }

  // Eliminar una accion por ID
  async remove(id: string): Promise<void> {
    const action = await this.actionModel.findByIdAndDelete(id).exec();
    if(!action){
      throw new NotFoundException(`Action with ID "${id}" not found`);
    }
  }
}
