import { IsEnum, IsNumber, IsOptional, IsString, ValidateIf, IsArray } from 'class-validator';
import { Donor } from '../entities/donor.entity';

export class CreateActionDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  cause: string;

  @IsEnum(['food', 'money', 'volunteer'])
  type: string;

  @IsOptional()
  @IsString()
  @ValidateIf(o => o.type === 'food')
  foodType?: string;

  @IsOptional()
  @IsNumber()
  @ValidateIf(o => o.type === 'food')
  foodGoalQuantity?: number;

  @IsOptional()
  @IsNumber()
  @ValidateIf(o => o.type === 'food')
  foodCurrentQuantity?: number;

  @IsOptional()
  @IsNumber()
  @ValidateIf(o => o.type === 'money')
  moneyGoalAmount?: number;

  @IsOptional()
  @IsNumber()
  @ValidateIf(o => o.type === 'money')
  moneyCurrentAmount?: number;

  @IsOptional()
  @IsNumber()
  @ValidateIf(o => o.type === 'volunteer')
  volunteerGoalCount?: number;

  @IsOptional()
  @IsNumber()
  @ValidateIf(o => o.type === 'volunteer')
  volunteerCurrentCount?: number;

  @IsOptional()
  @ValidateIf(o => o.type === 'volunteer')
  @IsString({ each: true })
  @IsArray()
  volunteers?: string[];

  @IsOptional()
  @ValidateIf(o => o.type === 'food' || o.type === 'money')
  @IsArray()
  donors?: Donor[];



}
