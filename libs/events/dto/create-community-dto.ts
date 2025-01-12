import { ODS_ENUM } from 'libs/enums/ods.enum';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class CreateCauseStatsDto {
  @IsString()
  @IsNotEmpty()
  public cause_id: string;

  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsArray()
  @IsNotEmpty()
  public ods: ODS_ENUM[];
}

export class CreateCommunityEventDto {
  @IsString()
  @IsNotEmpty()
  public community_id: string;

  @IsString()
  @IsNotEmpty()
  public user: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCauseStatsDto)
  public causes: CreateCauseStatsDto[];
}
