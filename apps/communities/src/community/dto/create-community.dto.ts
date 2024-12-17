import { IsArray, IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateCommunityDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDateString()
  creationDate: string;

  @IsNumber()
  creator: number;

  @IsString()
  status: string;

  @IsArray()
  members: number[];

  @IsArray()
  causes: string[];
}
