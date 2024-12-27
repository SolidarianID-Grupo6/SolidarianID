import { IsString, IsNumber } from 'class-validator';

export class DonateActionEventDto {
  @IsNumber()
  userId: number;

  @IsString()
  actionId: string;

  @IsNumber()
  donation: number;

}
