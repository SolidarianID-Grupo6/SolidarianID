import { IsString, IsNumber } from 'class-validator';

export class CreateActionDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  type: string;

  @IsString()
  status: string;

  @IsNumber()
  goal: number;

  @IsNumber()
  progress: number;
}
