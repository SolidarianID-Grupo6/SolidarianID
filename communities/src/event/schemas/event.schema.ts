import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  date: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Community' })
  community: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Action' }] })
  actions: string[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
