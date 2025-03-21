import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CommunityRequestStatus } from '../entities/CommunityRequest-status.enum';
import { CreateCauseDto } from '../../cause/dto/create-cause.dto';

export type CommunityRequestsDocument = CommunityRequests & Document;

@Schema()
export class CommunityRequests {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  creator: string;

  @Prop({ type: String, enum: Object.values(CommunityRequestStatus), default: CommunityRequestStatus.Pending })
  status: CommunityRequestStatus;

  @Prop({ default: new Date() })
  requestDate: Date;

  @Prop()
  rejectReason: string;

  @Prop({ required: true })
  causes: CreateCauseDto[];

}

export const CommunityRequestsSchema = SchemaFactory.createForClass(CommunityRequests);
