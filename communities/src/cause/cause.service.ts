import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Cause, CauseDocument } from './schemas/cause.schema.js';
import { CreateCauseDto } from './dto/create-cause.dto';
import { UpdateCauseDto } from './dto/update-cause.dto';

@Injectable()
export class CauseService {
  constructor(
    @InjectModel(Cause.name) private readonly causeModel: Model<CauseDocument>,
  ) {}

  // Crear una nueva causa
  async create(createCauseDto: CreateCauseDto): Promise<Cause> {
    const newCause = new this.causeModel(createCauseDto);
    return  newCause.save();
  }

  // Obtener todas las cusas
  async findAll(): Promise<Cause[]> {
    return this.causeModel.find().exec();
  }

  // Obtener una causa por ID
  async findOne(id: string): Promise<Cause> {
    const cause = await this.causeModel.findById(id).exec();
    if(!cause){
      throw new NotFoundException(`Cause with ID "${id}" not found`);
    }
    return cause;
  }

  // Actualizar una causa por ID
  async update(id: string, updateCauseDto: UpdateCauseDto): Promise<Cause> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: "${id}"`);
    }
    const updatedCause = await this.causeModel
      .findByIdAndUpdate(id, updateCauseDto, { new: true, runValidators: true })
      .exec();

    if(!updatedCause){
      throw new NotFoundException(`Cause with ID "${id}" not found`);
    }
    
    return updatedCause;
  }

  // Eliminar una causa por ID
  async remove(id: string): Promise<void> {
    const cause = await this.causeModel.findByIdAndDelete(id).exec();
    if(!cause){
      throw new NotFoundException(`Cause with ID "${id}" not found`);
    }
  }
}
