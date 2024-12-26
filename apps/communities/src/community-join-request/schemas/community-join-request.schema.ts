import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommunityJoinRequestDocument = CommunityJoinRequest & Document;

@Schema()
export class CommunityJoinRequest {

  @Prop({ required: true, _id: true })
  _id: string;

  @Prop({ type: [Number], default: [] })
  pendingRequests: number[];

}

export const CommunityJoinRequestSchema = SchemaFactory.createForClass(CommunityJoinRequest);
