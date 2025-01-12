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
import { ClientProxy } from '@nestjs/microservices';
import { CauseService } from '../cause/cause.service';
import { CommunityEntity } from './entities/community.entity';
import { CreateCauseDto } from '../cause/dto/create-cause.dto';
import { CreateCommunityEventDto } from 'libs/events/dto/create-community-dto';
import { CommunityEvent } from 'libs/events/enums/community.events.enum';

@Injectable()
export class CommunityService {
  constructor(
    @InjectModel(Community.name)
    private readonly communityModel: Model<CommunityDocument>,
    @Inject('NATS_SERVICE') private readonly client: ClientProxy,
    @Inject(forwardRef(() => CauseService))
    private readonly causeService: CauseService,
  ) { }

  async create(createCommunityDto: CreateCommunityDto, user: string): Promise<string> {
    // 1. Create community first without causes
    const newCommunity = new this.communityModel({
      ...createCommunityDto,
      members: [createCommunityDto.admin],
      admins: [createCommunityDto.admin],
    });
    const savedCommunity = await newCommunity.save();

    const causePromises = [];

    const idCommunity = String(savedCommunity._id);

    const causesEvent = [];

    // 2. Create causes with community reference
    for (const cause of createCommunityDto.causes) {
      // Crear el objeto de datos para cada causa
      const causeData: CreateCauseDto = {
        title: cause.title,
        description: cause.description,
        endDate: cause.endDate,
        category: cause.category,
        keywords: cause.keywords,
        location: cause.location,
        actions: [],
        events: [],
        ods: cause.ods,
        community: idCommunity
      };

      // Crear la promesa para la causa y agregarla al array
      const causeCreationPromise = this.causeService.create(idCommunity, causeData, user);
      causePromises.push(causeCreationPromise);

      const odsEnumValues = cause.ods.map((odsDescription) => this.causeService.mapToEnum(odsDescription));

      const causeId = await causeCreationPromise;

      // Crear el objeto de datos para el evento de causa
      const causeEvent = {
        cause_id: causeId,
        title: cause.title,
        ods: odsEnumValues,
      };

      causesEvent.push(causeEvent);
    }

    const createdCauses = await Promise.all(causePromises);

    // 3. Update community with cause references
    savedCommunity.causes = createdCauses;

    await savedCommunity.save();

    const communityEvent: CreateCommunityEventDto = {
      community_id: idCommunity,
      name: savedCommunity.name,
      user: user,
      causes: causesEvent
    };

    //Enviar evento a Users para que aparezca en el historial de comunidades del usuario
    this.client.emit(CommunityEvent.CreateCommunity, communityEvent);

    return idCommunity;
  }

  // Obtener todas las comunidades
  async findAll(): Promise<CommunityEntity[]> {
    const communities = await this.communityModel.find().exec();
    return communities.map(community => this.mapToEntity(community));
  }

  // Obtener una comunidad por ID
  async findOne(id: string): Promise<CommunityEntity> {
    const community = await this.communityModel.findById(id).exec();
    if (!community) {
      throw new NotFoundException(`Community with ID "${id}" not found`);
    }
    return this.mapToEntity(community);
  }

  // Actualizar una comunidad por ID
  async update(id: string, updateCommunityDto: UpdateCommunityDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
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

  }

  // Eliminar una comunidad por ID
  async remove(id: string): Promise<void> {
    const cause = await this.communityModel.findByIdAndDelete(id).exec();
    if (!cause) {
      throw new NotFoundException(`Cause with ID "${id}" not found`);
    }
  }

  async addMember(idCommunity: string, idUser: string) {
    const community = await this.communityModel.findById(idCommunity);

    if (!community) {
      throw new NotFoundException(`Community with ID "${idCommunity}" not found`);
    }

    if (community.members.includes(idUser)) {
      throw new BadRequestException(`User ${idUser} is already a member of this community`);
    }

    await this.communityModel.findByIdAndUpdate(
      idCommunity,
      { $push: { members: idUser } },
      { new: true, runValidators: true }
    ).exec();

    this.client.emit(CommunityEvent.NewCommunityUser, { idCommunity, idUser });;

  }

  private mapToEntity(document: CommunityDocument): CommunityEntity {
    return {
      id: String(document._id),
      name: document.name,
      description: document.description,
      creator: document.creator,
      members: document.members,
      admins: document.admins,
      causes: document.causes,
      creationDate: document.creationDate
    };
  }

}
