import { Injectable } from '@nestjs/common';
import { CommunityStats, InformationDocument } from './schemas/Information.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommunityEventDto } from 'libs/events/dto/create-community-dto';
import { SupportEventDto } from 'libs/events/dto/support-event.dto';
import { CreateCauseStatsDto } from 'libs/events/dto/create-cause-dto';
import { CreateActionStatsDto } from 'libs/events/dto/create-action-dto';
import { DonateEventDto } from 'libs/events/dto/donate-event-dto';

@Injectable()
export class InformationService {
  constructor(
    @InjectModel(CommunityStats.name)
    private readonly informationModel: Model<InformationDocument>) { }

  async getOdsByComunidad(idComunidad: string) {
    const community = await this.informationModel.findOne({
      community_id: idComunidad
    });

    // Extract ODS from all causes and flatten the array
    const allOds = community.causes.flatMap(cause => cause.ods);

    // Remove duplicates using Set
    const uniqueOds = [...new Set(allOds)];

    return uniqueOds;
  }

  async createInformation(data: CreateCommunityEventDto) {
    const newCommunityStats = new this.informationModel({
      community_id: data.community_id,
      name: data.name,
      causes: data.causes.map(cause => ({
        cause_id: cause.cause_id,
        title: cause.title,
        ods: cause.ods,
        total_supporters: 0,
        actions: []
      })),
      total_members: 1,
    });
    await newCommunityStats.save();
  }

  async newUserCommunity(idCommunity: string): Promise<void> {
    await this.informationModel.findOneAndUpdate(
      { community_id: idCommunity },
      { $inc: { total_members: 1 } },
      { new: true }
    ).exec();
  }

  async newUserSupport(data: SupportEventDto): Promise<void> {
    await this.informationModel.findOneAndUpdate(
      {
        community_id: data.communityId,
        'causes.cause_id': data.causeId
      },
      {
        $inc: { 'causes.$.total_supporters': 1 }
      },
      { new: true }
    ).exec();
  }

  async createCause(data: CreateCauseStatsDto) {
    const newCause = {
      cause_id: data.cause_id,
      title: data.title,
      ods: data.ods,
      actions: [],
      total_supporters: 0
    };

    await this.informationModel.findOneAndUpdate(
      { community_id: data.communityId },
      { $push: { causes: newCause } },
      { new: true }
    ).exec();
  }

  async createAction(data: CreateActionStatsDto) {
    const newAction = {
      action_id: data.actionId,
      title: data.title,
      description: data.description,
      goal: data.goal,
      progress: 0
    };

    await this.informationModel.findOneAndUpdate(
      { 'causes.cause_id': data.cause_id },
      { $push: { 'causes.$.actions': newAction } },
      { new: true }
    ).exec();
  }

  async donateorVolunteer(data: DonateEventDto): Promise<void> {
    // Encontrar la comunidad y marcarla como modificable
    const community = await this.informationModel.findOne({
      'causes.cause_id': data.causeId
    });

    // Encontrar los índices de la causa y acción
    const causeIndex = community.causes.findIndex(cause => cause.cause_id === data.causeId);
    const actionIndex = community.causes[causeIndex].actions.findIndex(action => action.action_id === data.actionId);

    // Actualizar el progreso directamente en el array
    community.causes[causeIndex].actions[actionIndex].progress += data.progress;

    community.markModified(`causes.${causeIndex}.actions.${actionIndex}.progress`);

    // Guardar los cambios
    await community.save();

  }

  async findOne(name: string) {
    return this.informationModel.findOne({ name: name });
  }

  getAll() {
    return this.informationModel.find().select('name -_id').exec();
  }


  //Estadisticas Generales
  async getCommunitiesByODS() {
    const communities = await this.informationModel.find().exec();
    const odsCounts = {};

    communities.forEach(community => {
      // Usamos Set para almacenar ODS únicos por comunidad
      const uniqueOdsInCommunity = new Set();

      community.causes.forEach(cause => {
        cause.ods.forEach(ods => {
          uniqueOdsInCommunity.add(ods);
        });
      });

      // Contamos solo los ODS únicos de esta comunidad
      uniqueOdsInCommunity.forEach((ods: string) => {
        odsCounts[ods] = (odsCounts[ods] || 0) + 1;
      });
    });

    return odsCounts;
  }

  async getCausesByODS() {
    const communities = await this.informationModel.find().exec();
    const odsCounts = {};

    communities.forEach(community => {
      community.causes.forEach(cause => {
        cause.ods.forEach(ods => {
          odsCounts[ods] = (odsCounts[ods] || 0) + 1;
        });
      });
    });

    return odsCounts;
  }

  async getSupportByODS() {
    const communities = await this.informationModel.find().exec();
    const odsSupport = {};

    communities.forEach(community => {
      community.causes.forEach(cause => {
        cause.ods.forEach(ods => {
          odsSupport[ods] = (odsSupport[ods] || 0) + cause.total_supporters;
        });
      });
    });

    return odsSupport;
  }

  async getSupportByCommunity() {
    const communities = await this.informationModel.find().exec();
    const communitySupport = {};

    communities.forEach(community => {
      let totalSupport = 0;
      community.causes.forEach(cause => {
        totalSupport += cause.total_supporters;
      });
      communitySupport[community.name] = totalSupport;
    });

    return communitySupport;
  }

  async getActionProgressByCommunity() {
    const communities = await this.informationModel.find().exec();
    const communityProgress = {};

    communities.forEach(community => {
      const actionsProgress = [];

      community.causes.forEach(cause => {
        cause.actions.forEach(action => {
          actionsProgress.push({
            title: action.title,
            progress: action.progress,
            goal: action.goal,
            percentageComplete: (action.progress / action.goal) * 100
          });
        });
      });

      communityProgress[community.name] = actionsProgress;
    });

    return communityProgress;
  }

}
