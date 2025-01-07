import { Donor } from "./donor.entity";

export class ActionEntity {
  id: string;

  title: string;

  description: string;

  creationDate: Date;

  cause: string;

  type: string;

  status: string;

  foodType?: string; // Específico para alimentos

  goal?: number; // Meta (puede variar según el tipo)
  
  progress?: number; // Progreso (puede variar según el tipo)

  volunteers?: string[]; // Específico para voluntarios

  donors?: Donor[]; // Donantes dentro de la acción

  current?: number; // Cantidad actual (puede variar según el tipo)
}
