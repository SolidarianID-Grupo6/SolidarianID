import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommunityDocument = Community & Document;

@Schema()
export class Community {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ default: new Date() })
  creationDate: Date;

  @Prop()
  creator: string;

  @Prop()
  admins: string[];

  @Prop({ type: [String] })
  members: string[];

  @Prop()
  causes: string[];
}

export const CommunitySchema = SchemaFactory.createForClass(Community);
