import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Cause, CauseDocument } from './schemas/cause.schema.js';import { CreateCauseDto } from './dto/create-cause.dto';
import { UpdateCauseDto } from './dto/update-cause.dto';

@Injectable()
export class CauseService {
  constructor(
    @InjectModel(Cause.name) private readonly causeModel: Model<CauseDocument>,
  ) {}

  // Crear una nueva causa
  create(createCauseDto: CreateCauseDto): Promise<Cause> {
    const newCause = new this.causeModel(createCauseDto);
    return  newCause.save();
  }

  async findAll(): Promise<Cause[]> {
    return this.causeModel.find().exec();
    
  }

  async findOne(id: number): Promise<Cause> {
    const cause = await this.causeModel.findById(id).exec();
    if(!cause){
      throw new NotFoundException(`Cause with ID "${id}" not found`);
    }
    return cause;
  }

  update(id: number, updateCauseDto: UpdateCauseDto) {
    return `This action updates a #${id} cause`;
  }

  remove(id: number) {
    return `This action removes a #${id} cause`;
  }
}
