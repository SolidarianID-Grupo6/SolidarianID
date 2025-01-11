import { IsString, IsNumber, IsArray, ArrayNotEmpty, ValidateNested, IsNotEmpty } from 'class-validator';
import { CreateCauseDto } from '../../cause/dto/create-cause.dto';
import { Type } from 'class-transformer';

export class CreateCommunityRequestsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  creator: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateCauseDto)
  causes: CreateCauseDto[];
}
