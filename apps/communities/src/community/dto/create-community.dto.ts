import { IsArray, IsString, ValidateNested } from 'class-validator';
import { CreateCauseDto } from '../../cause/dto/create-cause.dto';
import { Type } from 'class-transformer';

export class CreateCommunityDto {

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  admin: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCauseDto)
  causes: CreateCauseDto[];
}
