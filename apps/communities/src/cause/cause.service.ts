import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Cause, CauseDocument } from './schemas/cause.schema';
import { CreateCauseDto } from './dto/create-cause.dto';
import { UpdateCauseDto } from './dto/update-cause.dto';
import { CommunityService } from '../community/community.service';
import { SupportUserAnonymousDto } from './dto/supportUserAnonymous-cause.dto';
import { SupportUserRegisteredDto } from './dto/supportUserRegistered-cause.dto';

@Injectable()
export class CauseService {
  constructor(
    @InjectModel(Cause.name) private readonly causeModel: Model<CauseDocument>,
    private readonly communityService: CommunityService,
  ) {}

  // Crear una nueva causa
  async create(createCauseDto: CreateCauseDto): Promise<Cause> {
    const community = await this.communityService.findOne(createCauseDto.community);
    if (!community) {
      throw new BadRequestException(`Community with ID "${createCauseDto.community}" not found`);
    }
    const newCause = new this.causeModel(createCauseDto);
    return newCause.save();
  }
  // Obtener todas las cusas
  async findAll(): Promise<Cause[]> {
    return this.causeModel.find().exec();
  }

  // Obtener una causa por ID
  async findOne(id: string): Promise<Cause> {
    const cause = await this.causeModel.findById(id).exec();
    if (!cause) {
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

    if (!updatedCause) {
      throw new NotFoundException(`Cause with ID "${id}" not found`);
    }

    return updatedCause;
  }

  async supportUserAnonymous(id: string, supportUserAnonymousDto: SupportUserAnonymousDto): Promise<Cause> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: "${id}"`);
    }

    const updatedCause = await this.causeModel.findByIdAndUpdate(
      id,
      {
        $push: { 
          anonymousSupporters: {
            name: supportUserAnonymousDto.name,
            email: supportUserAnonymousDto.email
          }
        }
      },
      { new: true, runValidators: true }
    ).exec();

    if (!updatedCause) {
      throw new NotFoundException(`Cause with ID "${id}" not found`);
    }

    return updatedCause;
  }

  async supportUserRegistered(id: string, supportUserRegisteredDto: SupportUserRegisteredDto): Promise<Cause> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: "${id}"`);
    }

    const updatedCause = await this.causeModel.findByIdAndUpdate(
      id,
      {
        $push: { 
          registeredSupporters: supportUserRegisteredDto.userId
        }
      },
      { new: true, runValidators: true }
    ).exec();

    if (!updatedCause) {
      throw new NotFoundException(`Cause with ID "${id}" not found`);
    }

    return updatedCause;
  }

  // Eliminar una causa por ID
  async remove(id: string): Promise<void> {
    const cause = await this.causeModel.findByIdAndDelete(id).exec();
    if (!cause) {
      throw new NotFoundException(`Cause with ID "${id}" not found`);
    }
  }
}
