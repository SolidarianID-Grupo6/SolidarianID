import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommunityJoinRequestDocument } from './schemas/community-join-request.schema';
import { UserRequestDto } from './dto/user-request.dto';
import { CommunityJoinRequest } from './entities/community-join-request.entity';
import { CommunityService } from '../community/community.service';

@Injectable()
export class CommunityJoinRequestService {
  constructor(
    @InjectModel(CommunityJoinRequest.name)
    private readonly communityJoinRequestModel: Model<CommunityJoinRequestDocument>,
    @Inject(forwardRef(() => CommunityService))
    private readonly communityService: CommunityService,
  ) {}

  // Crear una nueva comunidad
  async create(communityId: string): Promise<CommunityJoinRequest> {
    const newCommunityJoinRequest = new this.communityJoinRequestModel({
        _id: communityId,
        pendingRequests: []
    });
    return newCommunityJoinRequest.save();
  }

  // Obtener todas las solicitudes de unión a comunidades
  async findAll(): Promise<CommunityJoinRequest[]> {
    return this.communityJoinRequestModel.find().exec();
  }

    // Obtener una comunidad por ID
    async findOne(id: string): Promise<CommunityJoinRequest> {
      const community = await this.communityJoinRequestModel.findById(id).exec();
      if (!community) {
        throw new NotFoundException(`Community with ID "${id}" not found`);
      }
      return community;
    }

  // Solicitar unirse a una comunidad
  async requestJoin(id: string, userRequest: UserRequestDto): Promise<CommunityJoinRequest> {
    const community = await this.communityService.findOne(id);

    if (!community) {
      throw new NotFoundException(`Community with ID "${id}" not found`);
    }

    const userId = userRequest.userId;

    if (community.members.includes(userId)) {
      throw new BadRequestException(
        `User with ID "${userRequest.userId}" is already a member`,
      );
    }

    const communityJoinRequest = await this.communityJoinRequestModel.findById(id).exec();

    if (communityJoinRequest.pendingRequests.includes(userId)) {
      throw new BadRequestException(
        `User with ID "${userId}" has already requested to join`,
      );
    }

    communityJoinRequest.pendingRequests.push(userId);

    return communityJoinRequest.save();
  }

  // Aceptar una solicitud de unirse a una comunidad
  async acceptRequest(id: string, userRequest: UserRequestDto): Promise<CommunityJoinRequest> {
    const community = await this.communityJoinRequestModel.findById(id).exec();

    if (!community) {
      throw new NotFoundException(`Community with ID "${id}" not found`);
    }
    
    const userId = userRequest.userId;
    
    if(!community.pendingRequests.includes(userId)) {
      throw new BadRequestException(
        `User with ID "${userId}" has not requested to join`,
      );
    }

    await this.communityService.addMember(id, userId);

    const updatedCommunity = await this.communityJoinRequestModel.findByIdAndUpdate(
      id,
      {
        $pull: { pendingRequests: userId },
      },
      { new: true, runValidators: true }
    ).exec();
    
    if (!updatedCommunity) {
      throw new NotFoundException(`Community not found`);
    }

    return updatedCommunity.save();
  }

  // Rechazar una solicitud de unirse a una comunidad
  async rejectRequest(id: string, userRequest: UserRequestDto): Promise<CommunityJoinRequest> {
    const community = await this.communityJoinRequestModel.findById(id).exec();

    if (!community) {
      throw new NotFoundException(`Community with ID "${id}" not found`);
    }

    const userId = userRequest.userId;

    if(!community.pendingRequests.includes(userId)) {
      throw new BadRequestException(
        `User with ID "${userId}" has not requested to join`,
      );
    }

    const updatedCommunity = await this.communityJoinRequestModel.findByIdAndUpdate(
      id,
      {
        $pull: { pendingRequests: userId },
      },
      { new: true, runValidators: true }
    ).exec();
    
    if (!updatedCommunity) {
      throw new NotFoundException(`Community not found`);
    }

    return updatedCommunity.save();
  }
}
