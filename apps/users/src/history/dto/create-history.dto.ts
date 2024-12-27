import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateHistoryDto {
  @IsNotEmpty()
  @IsString()
  action: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
