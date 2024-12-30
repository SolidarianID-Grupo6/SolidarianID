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
import { UserJoinRequestDto } from './dto/user-join-request.dto';
import { UserJoinStatus } from './entities/user-request-status.enum';

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

    const userId = userRequest.idUserId;

    if (community.members.includes(userId)) {
      throw new BadRequestException(
        `User with ID ${userRequest.idUserId} is already a member`,
      );
    }

    const communityJoinRequest = await this.communityJoinRequestModel.findOne({ 
      idCommunity: userRequest.idCommunity,
      idUserId: userRequest.idUserId 
    }).exec();

    
    if (communityJoinRequest) {
      throw new BadRequestException(`Request already exists for user ID ${userRequest.idUserId}`);
    }

    const requestJoinCommunity = this.communityJoinRequestModel.create({ 
      idCommunity: userRequest.idCommunity, 
      idUserId: userRequest.idUserId });

      return String((await requestJoinCommunity)._id);
  }

  // Aceptar una solicitud de unirse a una comunidad
  async acceptRequest(idRequest: string): Promise<void> {
    const request = await this.communityJoinRequestModel.findOne({ _id: idRequest }).exec();

    if (!request) {
      throw new NotFoundException(`Request with ID ${idRequest} not found`);
    }

    if (request.status !== UserJoinStatus.Pending) {
      throw new BadRequestException(`Request with ID ${idRequest} is already approved or rejected`);
    }

    //Poner estado a las solicitudes y poner pendeintes y aprobadas
  
    await this.communityService.addMember(request.idCommunity, request.userId);

    const updatedRequest = await this.communityJoinRequestModel.findByIdAndUpdate(
      idRequest,
      { status: UserJoinStatus.Approved },
      { new: true, runValidators: true }
    ).exec();

    if (!updatedRequest) {
      throw new NotFoundException(`Request with ID ${idRequest} not found`);
    }
    
  }

  // Rechazar una solicitud de unirse a una comunidad
  async rejectRequest(idRequest: string): Promise<void> {
    const request = await this.communityJoinRequestModel.findOne({ _id: idRequest }).exec();

    if (!request) {
      throw new NotFoundException(`Request with ID ${idRequest} not found`);
    }

    if (request.status !== UserJoinStatus.Pending) {
      throw new BadRequestException(`Request with ID ${idRequest} is already approved or rejected`);
    }

    const updatedRequest = await this.communityJoinRequestModel.findByIdAndUpdate(
      idRequest,
      { status: UserJoinStatus.Rejected },
      { new: true, runValidators: true }
    ).exec();
    
    if (!updatedRequest) {
      throw new NotFoundException(`Community not found`);
    }

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
      throw new NotFoundException(`Community with ID ${id} not found`);
    }
    return this.mapToEntity(request);
  }

  private mapToEntity(document: CommunityJoinRequestDocument): CommunityJoinRequestEntity {
    return {
      idCommunity: document.idCommunity,
      idUserId: document.userId,
      status: document.status,
    };
  }
}
