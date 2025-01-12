import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateActionStatsDto {

  @IsString()
  @IsNotEmpty()
  public actionId: string;

  @IsString()
  @IsNotEmpty()
  public cause_id: string;

  @IsString()
  @IsNotEmpty()
  public user: string;


  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsNumber()
  @IsNotEmpty()
  public goal: number;

}
