import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { Action, ActionDocument } from './schemas/action.schema';
import { DonateActionDto } from './dto/donate-action.dto';
import { VolunteerActionDto } from './dto/volunteer-action.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ActionEntity } from './entities/action.entity';
import { Cause, CauseDocument } from '../cause/schemas/cause.schema';
import { CommunityEvent } from 'libs/events/enums/community.events.enum';
import { CreateActionStatsDto } from 'libs/events/dto/create-action-dto';
import { DonateEventDto } from 'libs/events/dto/donate-event-dto';

@Injectable()
export class ActionService {
  constructor(
    @InjectModel(Action.name) private readonly actionModel: Model<ActionDocument>,
    @InjectModel(Cause.name) private readonly causeModel: Model<CauseDocument>,
    @Inject('NATS_SERVICE') private readonly client: ClientProxy,
  ) { }

  async createAction(createActionDto: CreateActionDto): Promise<string> {
    const { type, cause } = createActionDto;

    // Verifica si la causa existe
    const existingCause = await this.causeModel.findById(cause).exec();
    if (!existingCause) {
      throw new NotFoundException(`Cause with ID "${cause}" not found`);
    }

    let actionId: string;

    switch (type) {
      case 'food':
        actionId = await this.createFoodAction(createActionDto);
        break;
      case 'money':
        actionId = await this.createMoneyAction(createActionDto);
        break;
      case 'volunteer':
        actionId = await this.createVolunteerAction(createActionDto);
        break;
      default:
        throw new BadRequestException(`Invalid action type: ${type}`);
    }

    // Actualiza la causa para añadir la acción a su lista de acciones
    existingCause.actions.push(actionId);
    await existingCause.save();

    const actionEvent: CreateActionStatsDto = {
      actionId: actionId,
      cause_id: String(existingCause._id),
      title: createActionDto.title,
      description: createActionDto.description,
      goal: createActionDto.foodGoalQuantity | createActionDto.moneyGoalAmount | createActionDto.volunteerGoalCount,
    };

    this.client.emit(CommunityEvent.CreateAction, actionEvent);

    return actionId;
  }

  // Crear una nueva accion con objetivo de comida
  async createFoodAction(createActionDto: CreateActionDto): Promise<string> {
    // Validaciones específicas para food
    if (!createActionDto.foodType || !createActionDto.foodGoalQuantity) {
      throw new BadRequestException('Food actions require foodType and foodGoalQuantity');
    }

    createActionDto.foodCurrentQuantity = 0; // Inicializar valores
    const newAction = new this.actionModel(createActionDto);
    const savedAction = await newAction.save();
    return String(savedAction._id);
  }

  // Crear una nueva accion con objetivo de dinero
  async createMoneyAction(createActionDto: CreateActionDto): Promise<string> {
    // Validaciones específicas para money
    if (!createActionDto.moneyGoalAmount) {
      throw new BadRequestException('Money actions require moneyGoalAmount');
    }

    createActionDto.moneyCurrentAmount = 0; // Inicializar valores
    const newAction = new this.actionModel(createActionDto);
    const savedAction = await newAction.save();
    return String(savedAction._id);
  }

  // Crear una nueva accion con objetivo de voluntariado
  async createVolunteerAction(createActionDto: CreateActionDto): Promise<string> {
    // Validaciones específicas para volunteer
    if (!createActionDto.volunteerGoalCount) {
      throw new BadRequestException('Volunteer actions require volunteerGoalCount');
    }

    createActionDto.volunteerCurrentCount = 0; // Inicializar valores
    createActionDto.volunteers = []; // Inicializar array vacío
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

    const action = await this.actionModel.findById(id).exec();

    if (!action) {
      throw new NotFoundException(`Action with ID "${id}" not found`);
    }

    // Validaciones específicas según el tipo
    if (action.type === 'food' && updateActionDto.foodGoalQuantity) {
      action.foodGoalQuantity = updateActionDto.foodGoalQuantity;
    }

    if (action.type === 'money' && updateActionDto.moneyGoalAmount) {
      action.moneyGoalAmount = updateActionDto.moneyGoalAmount;
    }

    if (action.type === 'volunteer' && updateActionDto.volunteerGoalCount) {
      action.volunteerGoalCount = updateActionDto.volunteerGoalCount;
    }

    const updatedAction = await this.actionModel.findByIdAndUpdate(
      id,
      updateActionDto,
      { new: true, runValidators: true }
    ).exec();

    if (!updatedAction) {
      throw new NotFoundException(`Action with ID "${id}" not found`);
    }
  }

  async donate(id: string, donateActionDto: DonateActionDto): Promise<ActionEntity> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: "${id}"`);
    }

    const action = await this.actionModel.findById(id).exec();

    if (!action) {
      throw new NotFoundException(`Action with ID "${id}" not found`);
    }

    let updatedAction;

    // Lógica basada en el tipo de acción
    if (action.type === 'money') {
      // Donaciones monetarias
      const newMoneyAmount = (action.moneyCurrentAmount || 0) + donateActionDto.donation;

      // Verifica si se supera la meta
      if (action.moneyGoalAmount && newMoneyAmount > action.moneyGoalAmount) {
        throw new BadRequestException('Donation exceeds the goal amount');
      }

      const progress = Math.round((newMoneyAmount / action.moneyGoalAmount) * 100);

      // Actualiza la acción con el progreso y donantes
      updatedAction = await this.actionModel.findByIdAndUpdate(
        id,
        {
          $push: { donors: { userId: donateActionDto.user, amount: donateActionDto.donation } },
          moneyCurrentAmount: newMoneyAmount,
          progress: progress,
        },
        { new: true, runValidators: true }
      ).exec();

    } else if (action.type === 'food') {
      // Donaciones de alimentos
      const newFoodQuantity = (action.foodCurrentQuantity || 0) + donateActionDto.donation;

      // Verifica si se supera la meta
      if (action.foodGoalQuantity && newFoodQuantity > action.foodGoalQuantity) {
        throw new BadRequestException('Donation exceeds the food goal quantity');
      }

      const progress = Math.round((newFoodQuantity / action.foodGoalQuantity) * 100);

      // Actualiza la acción con el progreso
      updatedAction = await this.actionModel.findByIdAndUpdate(
        id,
        {
          $push: { donors: { userId: donateActionDto.user, amount: donateActionDto.donation } },
          foodCurrentQuantity: newFoodQuantity,
          progress: progress,
        },
        { new: true, runValidators: true }
      ).exec();

    } else {
      throw new BadRequestException('Donations are only applicable for money or food actions');
    }

    // Emitir el evento de donación
    const donateEvent: DonateEventDto = {
      actionId: String(action._id),
      causeId: String(action.cause),
      progress: donateActionDto.donation,
    };

    this.client.emit(CommunityEvent.DonateEvent, donateEvent);

    // Devuelve la acción actualizada
    return this.mapToEntity(updatedAction);
  }

  async volunteer(id: string, volunteerActionDto: VolunteerActionDto): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: "${id}"`);
    }

    const action = await this.actionModel.findById(id).exec();

    if (!action) {
      throw new NotFoundException(`Action with ID "${id}" not found`);
    }

    // Verifica si el usuario ya está en la lista de voluntarios
    if (action.volunteers.includes(volunteerActionDto.user)) {
      throw new BadRequestException(`User with ID "${volunteerActionDto.user}" already volunteered`);
    }

    const newCurrentCount = 1 + (action.volunteerCurrentCount || 0);

    // Verifica si se supera la meta
    if (action.volunteerGoalCount && newCurrentCount > action.volunteerGoalCount) {
      throw new BadRequestException('Donation exceeds the volunteers goal count');
    }

    const progress = Math.round((newCurrentCount / action.volunteerGoalCount) * 100);

    await this.actionModel.findByIdAndUpdate(
      id,
      {
        $push: { volunteers: volunteerActionDto.user },
        volunteerCurrentCount: newCurrentCount,
        progress: progress,
      },
      { new: true, runValidators: true }
    ).exec();

    // Emitir el evento de donación
    const donateEvent: DonateEventDto = {
      actionId: String(action._id),
      causeId: String(action.cause),
      progress: 1,
    };

    this.client.emit(CommunityEvent.DonateEvent, donateEvent);
  }

  // Eliminar una accion por ID
  async remove(id: string): Promise<void> {
    const action = await this.actionModel.findByIdAndDelete(id).exec();

    if (!action) {
      throw new NotFoundException(`Action with ID "${id}" not found`);
    }
  }

  private mapToEntity(document: ActionDocument): ActionEntity {
    const baseEntity: ActionEntity = {
      id: String(document._id),
      title: document.title,
      description: document.description,
      creationDate: document.creationDate,
      cause: document.cause,
      type: document.type,
      status: document.status,
      progress: document.progress || 0, // Asegura que progress siempre tenga un valor
    };

    // Mapea propiedades específicas según el tipo
    switch (document.type) {
      case 'food':
        baseEntity.goal = document.foodGoalQuantity || 0;
        baseEntity.current = document.foodCurrentQuantity || 0;
        baseEntity.foodType = document.foodType || null;
        baseEntity.donors = document.donors || [];
        break;

      case 'money':
        baseEntity.goal = document.moneyGoalAmount || 0;
        baseEntity.current = document.moneyCurrentAmount || 0;
        baseEntity.donors = document.donors || [];
        break;

      case 'volunteer':
        baseEntity.goal = document.volunteerGoalCount || 0;
        baseEntity.current = document.volunteerCurrentCount || 0;
        baseEntity.volunteers = document.volunteers || [];
        break;
    }

    return baseEntity;
  }

}
