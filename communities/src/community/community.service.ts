import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Community, CommunityDocument } from './schemas/community.schema.js';

@Injectable()
export class CommunityService {
  constructor(
    @InjectModel(Community.name) private readonly communityModel: Model<CommunityDocument>,
  ) {}

  // Método para crear una nueva comunidad
  async create(createCommunityDto: Partial<Community>): Promise<Community> {
    const newCommunity = new this.communityModel(createCommunityDto);
    return newCommunity.save();
  }

  // Método para obtener todas las comunidades
  async findAll(): Promise<Community[]> {
    return this.communityModel.find().exec();
  }
}
