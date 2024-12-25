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

  @Prop([{ type: Number }])
  volunteers: number[];

  @Prop([{
    userId: { type: Number },
    amount: { type: Number }
  }])
  donors: Array<{ userId: number, amount: number }>;

}

export const ActionSchema = SchemaFactory.createForClass(Action);
