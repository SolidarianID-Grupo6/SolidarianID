import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { CreateCauseDto } from '../../cause/dto/create-cause.dto';
import { Type } from 'class-transformer';

export class CreateCommunityDto {

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  admin: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCauseDto)
  causes: CreateCauseDto[];
}
