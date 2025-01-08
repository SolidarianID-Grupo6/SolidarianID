import { ODS_ENUM } from "@app/iam/authentication/enums/ods.enum";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateCauseStatsDto {

    @IsString()
    @IsNotEmpty()
    communityId: string;

    @IsString()
    @IsNotEmpty()
    cause_id: string;
  
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsArray()
    @IsNotEmpty()
    ods: ODS_ENUM[];
  }