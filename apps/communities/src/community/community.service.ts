import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Community, CommunityDocument } from './schemas/community.schema';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { CommunityJoinRequestService } from '../community-join-request/community-join-request.service';
import { ClientProxy } from '@nestjs/microservices';
import { UserJoinEventDto } from './dto/user-join-community.dto';

@Injectable()
export class CommunityService {
  constructor(
    @InjectModel(Community.name)
    private readonly communityModel: Model<CommunityDocument>,
    @Inject(forwardRef(() => CommunityJoinRequestService))
    private readonly communityJoinRequestService: CommunityJoinRequestService,
    @Inject('NATS_SERVICE') private readonly client: ClientProxy,
  ) {}

  // Crear una nueva comunidad
  async create(createCommunityDto: CreateCommunityDto): Promise<Community> {
    
    const newCommunity = new this.communityModel(createCommunityDto);
    
    const communityId = newCommunity._id.toString();

    await this.communityJoinRequestService.create(communityId);
    
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
  async update(
    id: string,
    updateCommunityDto: UpdateCommunityDto,
  ): Promise<Community> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: "${id}"`);
    }

    const updatedCommunity = await this.communityModel
      .findByIdAndUpdate(id, updateCommunityDto, {
        new: true,
        runValidators: true,
      })
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

  async addMember(idCommunity: string, idUser: number): Promise<Community> {
      const community = await this.communityModel.findById(idCommunity);
    
      if (!community) {
          throw new NotFoundException(`Community with ID "${idCommunity}" not found`);
      }

      if (community.members.includes(idUser)) {
          throw new BadRequestException(`User ${idUser} is already a member of this community`);
      }

      community.members.push(idUser);

      const userJoinCommunityEvent: UserJoinEventDto = {
          userId: idUser,
          communityId: idCommunity,
      };

      this.client.emit('user-joined-community', userJoinCommunityEvent);

      return community.save();
  }

}
