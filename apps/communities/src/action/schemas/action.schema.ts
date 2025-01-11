import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Donor } from '../entities/donor.entity';

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

  @Prop({ type: String, enum: ['food', 'money', 'volunteer'], required: true })
  type: string;

  @Prop()
  status: string;

  @Prop()
  foodType?: string; //Específico para alimentos

  @Prop()
  foodGoalQuantity?: number; // Objetivo de cantidad para alimentos

  @Prop()
  foodCurrentQuantity?: number; // Cantidad actual de alimentos

  @Prop()
  moneyGoalAmount?: number; // Objetivo monetario

  @Prop()
  moneyCurrentAmount?: number; // Cantidad actual de dinero

  @Prop()
  volunteerGoalCount?: number; // Objetivo de voluntarios

  @Prop()
  volunteerCurrentCount?: number; // Cantidad actual de voluntarios

  @Prop({
    type: [String],
    default: undefined, // Evita que MongoDB cree un array vacío automáticamente
    required: function (this: Action) {
      return this.type === 'volunteer';
    },
  })
  volunteers?: string[]; // Voluntarios dentro de la acción

  @Prop({
    type: Array,
    default: function (this: Action) {
      return this.type === 'food' || this.type === 'money' ? [] : undefined;
    },
  })
  donors?: Donor[]; // Donantes dentro de la acción

  @Prop()
  progress?: number;

}

export const ActionSchema = SchemaFactory.createForClass(Action);
