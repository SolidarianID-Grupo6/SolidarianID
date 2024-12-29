import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type CauseDocument = Cause & Document;

@Schema()
export class Cause {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ default: () => new Date() })
  creationDate: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }] })
  community: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Action' }] })
  actions: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }] })
  events: string[];

  @Prop([{ type: Number }])
  registeredSupporters: number[];
}
export const CauseSchema = SchemaFactory.createForClass(Cause);
