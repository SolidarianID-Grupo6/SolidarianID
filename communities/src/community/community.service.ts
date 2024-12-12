import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Community, CommunityDocument } from './schemas/community.schema.js';

@Injectable()
export class CommunityService {
  constructor(
    @InjectModel(Community.name) private readonly communityModel: Model<CommunityDocument>,
  ) {}

  // Crear una nueva comunidad
  async create(createCommunityDto: Partial<Community>): Promise<Community> {
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

}
