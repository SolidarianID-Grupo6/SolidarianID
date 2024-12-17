import { IsArray, IsDateString, IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateCommunityDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  creationDate?: string;

  @IsOptional()
  @IsNumber()
  creator?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsArray()
  members?: number[];

  @IsOptional()
  @IsArray()
  causes?: string[];
}
