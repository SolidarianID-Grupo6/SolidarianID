import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommunityRequestsDocument = CommunityRequests & Document;

@Schema()
export class CommunityRequests {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  creator: number;

  @Prop({ default: 'Pending' })
  status: string;

  @Prop({ default: new Date() })
  requestDate: Date;
}

export const CommunityRequestsSchema = SchemaFactory.createForClass(CommunityRequests);
