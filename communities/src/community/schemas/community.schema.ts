import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type CommunityDocument = Community & Document;

@Schema()
export class Community {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  creationDate: Date;

  @Prop()
  creator: number;

  @Prop()
  status: string;

  @Prop({ type: [Number] })
  members: number[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cause' }] })
  causes: string[];

  @Prop({ type: [Number], default: [] })
  pendingRequests: number[];

}

export const CommunitySchema = SchemaFactory.createForClass(Community);
