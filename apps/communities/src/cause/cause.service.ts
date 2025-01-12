import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Cause, CauseDocument } from './schemas/cause.schema';
import { CreateCauseDto } from './dto/create-cause.dto';
import { UpdateCauseDto } from './dto/update-cause.dto';
import { CommunityService } from '../community/community.service';
import { ClientProxy } from '@nestjs/microservices';
import { SupportEventDto } from '../../../../libs/events/dto/support-event.dto';
import { CauseEntity } from './entities/cause.entity';
import { ODS_ENUM } from 'libs/enums/ods.enum';
import { CommunityEvent } from 'libs/events/enums/community.events.enum';
import { CreateCauseStatsDto } from 'libs/events/dto/create-cause-dto';

@Injectable()
export class CauseService {
  constructor(
    @InjectModel(Cause.name) private readonly causeModel: Model<CauseDocument>,
    @Inject(forwardRef(() => CommunityService))
    private readonly communityService: CommunityService,
    @Inject('NATS_SERVICE') private readonly client: ClientProxy,
  ) { }

  // Crear una nueva causa
  async create(
    idCommunity: string,
    createCauseDto: CreateCauseDto, user: string
  ): Promise<string> {
    await this.communityService.findOne(idCommunity);

    const odsEnumValues = createCauseDto.ods.map((odsDescription) =>
      this.mapToEnum(odsDescription),
    );
    if (odsEnumValues.includes(undefined)) {
      throw new Error('Una o más descripciones de ODS son inválidas');
    }

    const causeWithOdsEnum = {
      ...createCauseDto,
      ods: odsEnumValues,
    };

    const createdCause = await this.causeModel.create(causeWithOdsEnum);

    const causeEvent: CreateCauseStatsDto = {
      communityId: idCommunity,
      cause_id: String(createdCause._id),
      user: +user,
      title: createCauseDto.title,
      ods: odsEnumValues,
    };

    this.client.emit(CommunityEvent.CreateCause, causeEvent);

    return String(createdCause._id);
  }

  mapToEnum(value: string): ODS_ENUM | undefined {
    const enumKey = Object.values(ODS_ENUM).find((val) => val === value);
    return enumKey as ODS_ENUM;
  }

  // Obtener todas las cusas
  async findAll(): Promise<CauseEntity[]> {
    const causes = await this.causeModel.find().exec();
    return causes.map((cause) => this.mapToEntity(cause));
  }

  // Obtener una causa por ID
  async findOne(id: string): Promise<CauseEntity> {
    const cause = await this.causeModel.findById(id).exec();
    if (!cause) {
      throw new NotFoundException(`Cause with ID "${id}" not found`);
    }
    return this.mapToEntity(cause);
  }

  // Actualizar una causa por ID
  async update(id: string, updateCauseDto: UpdateCauseDto): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: "${id}"`);
    }
    const updatedCause = await this.causeModel
      .findByIdAndUpdate(id, updateCauseDto, { new: true, runValidators: true })
      .exec();

    if (!updatedCause) {
      throw new NotFoundException(`Cause with ID "${id}" not found`);
    }
  }

  async supportUserRegistered(
    id: string, user: string
  ): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: "${id}"`);
    }

    const cause = await this.causeModel.findById(id).exec();

    if (!cause) {
      throw new NotFoundException(`Cause with ID "${id}" not found`);
    }

    if (cause.registeredSupporters.includes(+user)) {
      throw new BadRequestException(
        `User ${user} is already registered as a supporter`,
      );
    }

    const updatedCause = await this.causeModel
      .findByIdAndUpdate(
        id,
        {
          $push: {
            registeredSupporters: user,
          },
        },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedCause) {
      throw new NotFoundException(`Cause with ID ${id} not found`);
    }

    const support_event: SupportEventDto = {
      causeId: id,
      communityId: cause.community,
      user: +user,
    };

    this.client.emit(CommunityEvent.NewSupport, support_event);
  }

  // Eliminar una causa por ID
  async remove(id: string): Promise<void> {
    const cause = await this.causeModel.findByIdAndDelete(id).exec();
    if (!cause) {
      throw new NotFoundException(`Cause with ID "${id}" not found`);
    }
  }

  private mapToEntity(document: CauseDocument): CauseEntity {
    return {
      id: String(document._id),
      title: document.title,
      description: document.description,
      creationDate: document.creationDate,
      endDate: document.endDate,
      community: document.community,
      actions: document.actions,
      events: document.events,
      registeredSupporters: document.registeredSupporters,
      status: document.status,
      category: document.category,
      keywords: document.keywords,
      location: document.location,
    };
  }
}
