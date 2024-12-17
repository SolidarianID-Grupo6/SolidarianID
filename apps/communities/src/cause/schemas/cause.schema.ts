import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type CauseDocument = Cause & Document;

@Schema()
export class Cause {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  creationDate: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }] })
  community: string;

  @Prop()
  status: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Action' }] })
  actions: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }] })
  events: string[];
}

export const CauseSchema = SchemaFactory.createForClass(Cause);
