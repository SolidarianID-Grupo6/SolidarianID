import { Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Community, CommunityDocument } from './schemas/community.schema.js';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';

@Injectable()
export class CommunityService {
  constructor(
    @InjectModel(Community.name) private readonly communityModel: Model<CommunityDocument>,
  ) {}

  // Crear una nueva comunidad
  async create(createCommunityDto: CreateCommunityDto): Promise<Community> {
    const newCommunity = new this.communityModel(createCommunityDto);
    return newCommunity.save();
  }

  // Obtener todas las comunidades
  async findAll(): Promise<Community[]> {
    return this.communityModel.find().exec();
  }

  // Obtener una comunidad por ID
  async findOne(id: string): Promise<Community> {
    const community = await this.communityModel.findById(id).exec();
    if (!community) {
      throw new NotFoundException(`Community with ID "${id}" not found`);
    }
    return community;
  }

  // Actualizar una comunidad por ID
  async update(id: string, updateCommunityDto: UpdateCommunityDto): Promise<Community> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: "${id}"`);
    }

    const updatedCommunity = await this.communityModel
      .findByIdAndUpdate(id, updateCommunityDto, { new: true, runValidators: true })
      .exec();

    if (!updatedCommunity) {
      throw new NotFoundException(`Community with ID "${id}" not found`);
    }

    return updatedCommunity;
  }

  // Eliminar una comunidad por ID
  async remove(id: string): Promise<void> {
    const cause = await this.communityModel.findByIdAndDelete(id).exec();
    if (!cause) {
      throw new NotFoundException(`Cause with ID "${id}" not found`);
    }
  }

}
