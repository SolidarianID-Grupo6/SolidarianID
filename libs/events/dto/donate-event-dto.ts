import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DonateEventDto {
  @IsString()
  @IsNotEmpty()
  public actionId: string;

  @IsString()
  @IsNotEmpty()
  public causeId: string;

  @IsString()
  @IsNotEmpty()
  public user: string;

  @IsString()
  @IsNotEmpty()
  public type: string;

  @IsNumber()
  @IsNotEmpty()
  public progress: number;
}
