import { ODS_ENUM } from 'libs/enums/ods.enum';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCauseStatsDto {
  @IsString()
  @IsNotEmpty()
  public communityId: string;

  @IsString()
  @IsNotEmpty()
  public cause_id: string;

  @IsNumber()
  @IsNotEmpty()
  public user: number;

  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsArray()
  @IsNotEmpty()
  public ods: ODS_ENUM[];
}
