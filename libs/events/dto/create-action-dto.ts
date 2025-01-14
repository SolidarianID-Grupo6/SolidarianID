import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateActionStatsDto {
  @IsString()
  @IsNotEmpty()
  public actionId: string;

  @IsString()
  @IsNotEmpty()
  public cause_id: string;

  @IsNumber()
  @IsNotEmpty()
  public userId: string;

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
