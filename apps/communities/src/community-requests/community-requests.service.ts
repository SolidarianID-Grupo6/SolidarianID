import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommunityRequests, CommunityRequestsDocument } from './schemas/community-requests.schema';
import { CreateCommunityRequestsDto } from './dto/create-community-request.dto';
import { ClientProxy } from '@nestjs/microservices';
import { CommunityService } from '../community/community.service';
import { CommunityRequestStatus } from './entities/CommunityRequest-status.enum';
import { CreateCommunityDto } from '../community/dto/create-community.dto';
import { CommunityRequestsEntity } from './entities/community-request.entity';

@Injectable()
export class CommunityRequestsService {
  constructor(
    @InjectModel(CommunityRequests.name) private readonly requestModel: Model<CommunityRequestsDocument>,
    @Inject('NATS_SERVICE') private readonly client: ClientProxy,
    private readonly communityService: CommunityService,
  ) {}

  // Crear una nueva solicitud
  async createRequest(createRequestDto: CreateCommunityRequestsDto): Promise<string> {
    const existingCommunity = await this.requestModel.findOne({
      name: createRequestDto.name,
      status: { $in: [CommunityRequestStatus.Pending, CommunityRequestStatus.Approved] },
    }).exec();
    
    if (existingCommunity) {
      throw new BadRequestException(
        `A request with the community name ${createRequestDto.name} already exists`
      );
    }

    const createdRequest = await this.requestModel.create(createRequestDto);
    
    return String(createdRequest._id);
  }

  // Listar todas las solicitudes pendientes
  async findAllPending(): Promise<CommunityRequestsEntity[]> {
    const requests = await this.requestModel.find({ status: CommunityRequestStatus.Pending }).exec();
    return requests.map(request => this.mapToEntity(request));
  }

  async findOne(id: string): Promise<CommunityRequestsEntity> {
    const request = await this.requestModel.findById(id).exec();
    if (!request) {
      throw new NotFoundException(`Community with ID ${id} not found`);
    }
    return this.mapToEntity(request);
  }

  // Aprobar una solicitud y crear la comunidad
  async approveRequest(requestId: string): Promise<string> {
    const request1 = await this.requestModel.findById(
      requestId).exec();

    if (!request1) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (request1.status === CommunityRequestStatus.Approved ) {
      throw new BadRequestException('La solicitud no ha sido aprobada');
    }

    if (request1.status === CommunityRequestStatus.Rejected ) {
      throw new BadRequestException('La solicitud no ha sido aprobada');
    }

    const request = await this.requestModel.findByIdAndUpdate(
      requestId,
      { status: CommunityRequestStatus.Approved },
      { new: true },
    ).exec();

    const createCommunity: CreateCommunityDto = {
      name: request.name,
      description: request.description,
      admin: request.creator,
      causes: request.causes,
    };

    const id = await this.communityService.create(createCommunity);
    
    return id;
  }
  
  // Rechazar una solicitud
  async rejectRequest(requestId: string): Promise<void> {
    const request1 = await this.requestModel.findById(
      requestId,
    ).exec();

    if (!request1) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (request1.status === CommunityRequestStatus.Approved ) {
      throw new BadRequestException('La solicitud no ha sido rechazada');
    }

    if (request1.status === CommunityRequestStatus.Rejected ) {
      throw new BadRequestException('La solicitud no ha sido rechazada');
    }

    await this.requestModel.findByIdAndUpdate(
      requestId,
      { status: CommunityRequestStatus.Rejected },
      { new: true },
    ).exec();
  }

  // Método helper para mapear de Document a Entity
  private mapToEntity(document: CommunityRequestsDocument): CommunityRequestsEntity {
    return {
      id: String(document._id),
      name: document.name,
      description: document.description,
      creator: document.creator,
      status: document.status,
      requestDate: document.requestDate,
      causes: document.causes
    };
  }
}
