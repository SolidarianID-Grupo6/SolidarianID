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

  // Solicitar unirse a una comunidad
  async requestJoin(id: string, userId: number): Promise<Community> {
    const community = await this.communityModel.findById(id).exec();
  
    if (!community) {
      throw new NotFoundException(`Community with ID "${id}" not found`);
    }
  
    if (community.members.includes(userId)) {
      throw new BadRequestException(`User with ID "${userId}" is already a member`);
    }
  
    if (community.pendingRequests.includes(userId)) {
      throw new BadRequestException(`User with ID "${userId}" has already requested to join`);
    }
  
    community.pendingRequests.push(userId);
    return community.save();
  }
  
  // Aceptar una solicitud de unirse a una comunidad
  async acceptRequest(id: string, userId: number): Promise<Community> {
    const community = await this.communityModel.findById(id).exec();
  
    if (!community) {
      throw new NotFoundException(`Community with ID "${id}" not found`);
    }
  
    const requestIndex = community.pendingRequests.indexOf(userId);
    if (requestIndex === -1) {
      throw new BadRequestException(`No pending request found for user with ID "${userId}"`);
    }
  
    // Mover de solicitudes pendientes a miembros
    community.pendingRequests.splice(requestIndex, 1);
    community.members.push(userId);
  
    return community.save();
  }
  
  // Rechazar una solicitud de unirse a una comunidad
  async rejectRequest(id: string, userId: number): Promise<Community> {
    const community = await this.communityModel.findById(id).exec();
  
    if (!community) {
      throw new NotFoundException(`Community with ID "${id}" not found`);
    }
  
    const requestIndex = community.pendingRequests.indexOf(userId);
    if (requestIndex === -1) {
      throw new BadRequestException(`No pending request found for user with ID "${userId}"`);
    }
  
    // Eliminar de solicitudes pendientes
    community.pendingRequests.splice(requestIndex, 1);
  
    return community.save();
  }
  

}
