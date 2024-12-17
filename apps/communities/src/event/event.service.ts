import { Injectable, NotFoundException, BadRequestException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
  ) {}

  // Crear un nuevo evento
  async create(createEventDto: CreateEventDto): Promise <Event> {
    const newEvent = new this.eventModel(createEventDto);
    return newEvent.save();
  }

  // Obtener todos los eventos
  async findAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }

  // Obtener un evento por ID
  async findOne(id: number) {
    const event = this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }
    return event;
  }

  // Actualizar un evento por ID
  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    if(!isValidObjectId(id)){
      throw new BadRequestException(`Invalid ID format: "${id}"`);
    }
    const updatedEvent = await this.eventModel
      .findById(id, updateEventDto, { new: true, runValidators: true })
      .exec();
    if(!updatedEvent){
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }
    return updatedEvent;
  }

  // Eliminar un evento por ID
  async remove(id: number): Promise<void> {
    const event = await this.eventModel.findByIdAndDelete(id).exec();
    if(!event){
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }
  }
}
