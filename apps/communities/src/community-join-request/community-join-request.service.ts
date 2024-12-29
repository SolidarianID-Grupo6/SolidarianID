import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommunityJoinRequest, CommunityJoinRequestDocument } from './schemas/community-join-request.schema';
import { CommunityJoinRequestEntity } from './entities/community-join-request.entity';
import { CommunityService } from '../community/community.service';

@Injectable()
export class CommunityJoinRequestService {
  constructor(
    @InjectModel(CommunityJoinRequest.name)
    private readonly communityJoinRequestModel: Model<CommunityJoinRequestDocument>,
    @Inject(forwardRef(() => CommunityService))
    private readonly communityService: CommunityService,
  ) {}

  // Solicitar unirse a una comunidad
  async requestJoin(userRequest: UserJoinRequestDto): Promise<string> {
    const community = await this.communityService.findOne(userRequest.idCommunity);

    if (!community) {
      throw new NotFoundException(`Community with ID ${userRequest.idCommunity} not found`);
    }

    const userId = userRequest.userId;

    if (community.members.includes(userId)) {
      throw new BadRequestException(
        `User with ID ${userRequest.userId} is already a member`,
      );
    }

    const communityJoinRequest = await this.communityJoinRequestModel.findOne({ 
      idCommunity: userRequest.idCommunity,
      idUserId: userRequest.userId 
    }).exec();

    
    if (communityJoinRequest) {
      throw new BadRequestException(`Request already exists for user ID ${userRequest.userId}`);
    }

    const requestJoinCommunity = this.communityJoinRequestModel.create({ 
      idCommunity: userRequest.idCommunity, 
      idUserId: userRequest.userId });

      return (await requestJoinCommunity)._id.toString();
  }

  // Aceptar una solicitud de unirse a una comunidad
  async acceptRequest(idRequest: string): Promise<void> {
    const request = await this.communityJoinRequestModel.findOne({ _id: idRequest }).exec();

    if (!request) {
      throw new NotFoundException(`Request with ID ${idRequest} not found`);
    }
    //Poner estado a las solicitudes y poner pendeintes y aprobadas
  
    await this.communityService.addMember(id, userId);

    const updatedCommunity = await this.communityJoinRequestModel.findByIdAndUpdate(
      id,
      {
        $pull: { pendingRequests: userId },
      },
      { new: true, runValidators: true }
    ).exec();
    
    if (!updatedCommunity) {
      throw new NotFoundException(`Community with ID ${id} not found`);
    }
    
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


  // Obtener todas las solicitudes de unión a comunidades
  async findAll(): Promise<CommunityJoinRequestEntity[]> {
    const requests = await this.communityJoinRequestModel.find().exec();
    return requests.map(request => this.mapToEntity(request));
  }

  // Obtener una comunidad por ID
  async findOne(id: string): Promise<CommunityJoinRequestEntity> {
    const request = await this.communityJoinRequestModel.findById(id).exec();
    if (!request) {
      throw new NotFoundException(`Community with ID "${id}" not found`);
    }
    return this.mapToEntity(request);
  }

  private mapToEntity(document: CommunityJoinRequestDocument): CommunityJoinRequestEntity {
    return {
      idCommunity: document.idCommunity,
      idUserId: document.userId,
    };
  }
}
