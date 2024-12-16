import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type ActionDocument = Action & Document;

@Schema()
export class Action {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: Date, default: Date.now })
  creationDate: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cause', required: true })
  cause: string;

  @Prop({ required: true })
  type: string; 

  @Prop()
  status: string;

  @Prop()
  goal: number;

  @Prop()
  progress: number; 
}

export const ActionSchema = SchemaFactory.createForClass(Action);
