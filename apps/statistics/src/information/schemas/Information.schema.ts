import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ODS_ENUM } from '@app/iam/authentication/enums/ods.enum';

export type InformationDocument = CommunityStats & Document;

class ActionStats {
  @Prop({ required: true })
  action_id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  goal: number;

  @Prop({ required: true })
  progress: number;
}

class CauseStats {
  @Prop({ required: true })
  cause_id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ type: [String], enum: ODS_ENUM })
  ods: ODS_ENUM[];

  @Prop({ type: [ActionStats] })
  actions: ActionStats[];

  @Prop({ default: 0 })
  total_supporters: number;
}

@Schema({ timestamps: true })
export class CommunityStats {
  @Prop({ required: true, unique: true })
  community_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: 1 })
  total_members: number;

  @Prop({ type: [CauseStats] })
  causes: CauseStats[];
}

export const CommunityStatsSchema = SchemaFactory.createForClass(CommunityStats);
