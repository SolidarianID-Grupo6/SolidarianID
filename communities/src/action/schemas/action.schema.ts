import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type ActionDocument = Action & Document;

@Schema()
export class Action {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cause' }] })
  cause: string;

  @Prop()
  status: string;

  @Prop()
  creationDate: Date;
}

export const ActionSchema = SchemaFactory.createForClass(Action);
