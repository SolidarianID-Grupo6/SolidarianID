import { IsArray, IsNumber, IsString } from 'class-validator';
import { Cause } from '../../cause/schemas/cause.schema';

export class CreateCommunityDto {

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  admin: number;

  @IsArray()
  causes: Cause[];
}
