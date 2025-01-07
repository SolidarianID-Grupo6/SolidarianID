import { IsNumber, IsString } from 'class-validator';

export class DonateActionDto {
  @IsString()
  user: string;

  @IsNumber()
  donation: number;
}
