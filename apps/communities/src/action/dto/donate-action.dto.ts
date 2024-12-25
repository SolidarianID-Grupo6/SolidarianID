import { IsNumber } from 'class-validator';

export class DonateActionDto {
  @IsNumber()
  user: number;

  @IsNumber()
  donation: number;
}
