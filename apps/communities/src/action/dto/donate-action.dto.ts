import { IsNumber } from 'class-validator';

export class DonateActionDto {
  @IsNumber()
  donation: number;
}
