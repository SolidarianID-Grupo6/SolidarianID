import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateActionStatsDto {

    @IsString()
    @IsNotEmpty()
    actionId: string;

    @IsString()
    @IsNotEmpty()
    cause_id: string;
  
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    goal: number;

  }
