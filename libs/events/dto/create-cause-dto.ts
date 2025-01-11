import { ODS_ENUM } from "@app/iam/authentication/enums/ods.enum";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateCauseStatsDto {

  @IsString()
  @IsNotEmpty()
  public communityId: string;

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
