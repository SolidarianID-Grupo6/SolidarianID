import { Injectable, NotFoundException, BadRequestException, Inject  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { Action, ActionDocument } from './schemas/action.schema';
import { DonateActionDto } from './dto/donate-action.dto';
import { VolunteerActionDto } from './dto/volunteer-action.dto';
import { ClientProxy } from '@nestjs/microservices';
import { VolunteerActionEventDto } from './dto/volunteer-action-event.dto';
import { DonateActionEventDto } from './dto/donate-action-event.dto copy';
import { ActionEntity } from './entities/action.entity';


@Injectable()
export class ActionService {
  constructor(
    @InjectModel(Action.name) private readonly actionModel: Model<ActionDocument>,
    @Inject('NATS_SERVICE') private readonly client: ClientProxy,
  ) {}
  
  // Crear una nueva accion
  async create(createActionDto: CreateActionDto): Promise<string> {
    const newAction = new this.actionModel(createActionDto);
    const savedAction = await newAction.save();
    return String(savedAction._id);
  }

  // Obtener todas las acciones
  async findAll(): Promise<ActionEntity[]> {
    const actions = await this.actionModel.find().exec();
    return actions.map(action => this.mapToEntity(action));
  }

  // Obtener una accion por ID
  async findOne(id: string): Promise<ActionEntity> {
    const action = await this.actionModel.findById(id).exec();
    if (!action) {
      throw new NotFoundException(`Action with ID "${id}" not found`);
    }
    return this.mapToEntity(action);
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

    if (!updatedAction) {
      throw new NotFoundException(`Action with ID "${id}" not found`);
    }

    const donate_event: DonateActionEventDto = {
      userId: donateActionDto.user,
      actionId: id,
      donation: donateActionDto.donation
    }

    this.client.emit('donate-event', donate_event);

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
    
    await this.actionModel.findByIdAndUpdate(
      id,
      {
        $push: { volunteers: volunteerAction.user }
      },
      { new: true, runValidators: true }
    ).exec();

    const volunteer_event: VolunteerActionEventDto = {
      userId: volunteerAction.user,
      actionId: id
    }

    this.client.emit('volunteer-event', volunteer_event);

  }

  // Eliminar una accion por ID
  async remove(id: string): Promise<void> {
    const action = await this.actionModel.findByIdAndDelete(id).exec();
    if(!action){
      throw new NotFoundException(`Action with ID "${id}" not found`);
    }
  }


  private mapToEntity(document: ActionDocument): ActionEntity {
    return {
      id: String(document._id),
      title: document.title,
      description: document.description,
      creationDate: document.creationDate,
      cause: document.cause,
      type: document.type,
      status: document.status,
      goal: document.goal,
      progress: document.progress,
      volunteers: document.volunteers,
      donors: document.donors
    };
  }
}
