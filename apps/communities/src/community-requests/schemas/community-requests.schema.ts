import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Cause } from '../../cause/schemas/cause.schema';
import { CommunityRequestStatus } from '../entities/CommunityRequest-status.enum';

export type CommunityRequestsDocument = CommunityRequests & Document;

@Schema()
export class CommunityRequests {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  creator: number;

  @Prop({ default: CommunityRequestStatus.Pending })
  status: CommunityRequestStatus;

  @Prop({ default: new Date() })
  requestDate: Date;

  @Prop({ required: true})
  causes: Cause[];

}

export const CommunityRequestsSchema = SchemaFactory.createForClass(CommunityRequests);
