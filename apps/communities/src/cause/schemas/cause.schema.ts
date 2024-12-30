import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { CauseStatus } from '../entities/cause-status.enum';

export type CauseDocument = Cause & Document;

@Schema()
export class Cause {

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ default: () => new Date() })
  creationDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }] })
  community: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Action' }] })
  actions: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }] })
  events: string[];

  @Prop([{ type: Number }])
  registeredSupporters: number[];

  @Prop({ type: String, default: CauseStatus.Active })
  status: CauseStatus;

  @Prop({ type: String })
  category?: string;
  
  @Prop({ type: [String], default: [] })
  keywords?: string[];
  
  @Prop({ type: String})
  location?: string;
  

}
export const CauseSchema = SchemaFactory.createForClass(Cause);
