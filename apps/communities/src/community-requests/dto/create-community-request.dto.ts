import { IsString, IsNumber, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateCommunityRequestsDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  creator: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  causes: string[];
}
