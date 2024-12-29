import { IsString, IsNumber, IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { CreateCauseDto } from '../../cause/dto/create-cause.dto';
import { Type } from 'class-transformer';

export class CreateCommunityRequestsDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  creator: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateCauseDto)
  causes: CreateCauseDto[];
}
