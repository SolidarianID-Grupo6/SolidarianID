import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommunityJoinRequestDocument = CommunityJoinRequest & Document;

@Schema()
export class CommunityJoinRequest {

  @Prop({ type: [String]})
  idCommunity: string;  

  @Prop({ type: [Number]})
  userId: number;

}

export const CommunityJoinRequestSchema = SchemaFactory.createForClass(CommunityJoinRequest);
