import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommunityRequests, CommunityRequestsDocument } from './schemas/community-requests.schema';
import { Community, CommunityDocument } from '../community/schemas/community.schema';
import { CreateCommunityRequestsDto } from './dto/create-community-request.dto';

@Injectable()
export class CommunityRequestsService {
  constructor(
    @InjectModel(CommunityRequests.name) private readonly requestModel: Model<CommunityRequestsDocument>,
    @InjectModel(Community.name) private readonly communityModel: Model<CommunityDocument>,
  ) {}

  // Crear una nueva solicitud
  async createRequest(createRequestDto: CreateCommunityRequestsDto): Promise<CommunityRequests> {
    return this.requestModel.create(createRequestDto);
  }

  // Listar todas las solicitudes pendientes
  async findAllPending(): Promise<CommunityRequests[]> {
    return this.requestModel.find({ status: 'Pending' }).exec();
  }

  async findOne(id: string): Promise<CommunityRequests> {
    const communityRequests = await this.requestModel.findById(id).exec();
    if (!communityRequests) {
      throw new NotFoundException(`Community with ID "${id}" not found`);
    }
    return communityRequests;
  }

  // Aprobar una solicitud y crear la comunidad
  async approveRequest(requestId: string): Promise<Community> {
    const request = await this.requestModel.findById(requestId).exec();

    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    // Crear la comunidad
    const community = await this.communityModel.create({
      name: request.name,
      description: request.description,
      creationDate: new Date(),
      creator: request.creator,
      status: 'Active',
      members: [],
      causes: [],
    });

    // Actualizar el estado de la solicitud
    request.status = 'Approved';
    await request.save();

    return community;
  }

  // Rechazar una solicitud
  async rejectRequest(requestId: string): Promise<CommunityRequests> {
    const request = await this.requestModel.findByIdAndUpdate(
      requestId,
      { status: 'Rejected' },
      { new: true },
    ).exec();

    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    return request;
  }
}
