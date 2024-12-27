import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommunityRequests, CommunityRequestsDocument } from './schemas/community-requests.schema';
import { CreateCommunityRequestsDto } from './dto/create-community-request.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CommunityRequestsService {
  constructor(
    @InjectModel(CommunityRequests.name) private readonly requestModel: Model<CommunityRequestsDocument>,
    @Inject('NATS_SERVICE') private readonly client: ClientProxy,
  ) {}

  // Crear una nueva solicitud
  async createRequest(createRequestDto: CreateCommunityRequestsDto): Promise<CommunityRequests> {
    const existingCommunity = await this.requestModel.findOne({ 
      name: createRequestDto.name 
    }).exec();
    
    if (existingCommunity) {
      throw new BadRequestException(`Community name "${createRequestDto.name}" already exists`);
    }

    return this.requestModel.create(createRequestDto);
  }

  // Listar todas las solicitudes pendientes
  async findAllPending(): Promise<CommunityRequests[]> {
    return this.requestModel.find({ status: 'Pending' }).exec();;
  }

  async findOne(id: string): Promise<CommunityRequests> {
    const communityRequests = await this.requestModel.findById(id).exec();
    if (!communityRequests) {
      throw new NotFoundException(`Community with ID "${id}" not found`);
    }
    return communityRequests;
  }

  // Aprobar una solicitud y crear la comunidad
  async approveRequest(requestId: string): Promise<CommunityRequests> {
    const request = await this.requestModel.findById(requestId).exec();

    if (!request) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    //Hay que llamar al servicio de comunidades y crear la comunidad
    //Tambien hacer un evento para notificar a los usuarios que la comunidad fue creada

    // Actualizar el estado de la solicitud
    request.status = 'Approved';

    return request.save();;
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
