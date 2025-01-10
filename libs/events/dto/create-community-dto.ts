import { ODS_ENUM } from "@app/iam/authentication/enums/ods.enum";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class CreateCauseStatsDto {
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
  
  export class CreateCommunityEventDto {
    @IsString()
    @IsNotEmpty()
    community_id: string;
  
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateCauseStatsDto)
    causes: CreateCauseStatsDto[];
  }
