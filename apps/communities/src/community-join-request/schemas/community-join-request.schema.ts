import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserJoinStatus } from '../entities/user-request-status.enum';

export type CommunityJoinRequestDocument = CommunityJoinRequest & Document;

@Schema()
export class CommunityJoinRequest {

  @Prop({ type: [String]})
  idCommunity: string;  

  @Prop({ type: [Number]})
  userId: number;

  @Prop({ type: String, default: UserJoinStatus.Pending })
  status: UserJoinStatus;

}

export const CommunityJoinRequestSchema = SchemaFactory.createForClass(CommunityJoinRequest);
