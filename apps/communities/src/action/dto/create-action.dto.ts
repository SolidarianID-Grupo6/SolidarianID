import { IsEnum, IsNumber, IsOptional, IsString, ValidateIf, IsArray } from 'class-validator';
import { Donor } from '../entities/donor.entity';

export class CreateActionDto {
  @IsString()
  public title: string;

  @IsString()
  public description: string;

  @IsString()
  public cause: string;

  @IsEnum(['food', 'money', 'volunteer'])
  public type: string;

  @IsOptional()
  @IsString()
  @ValidateIf(o => o.type === 'food')
  public foodType?: string;

  @IsOptional()
  @IsNumber()
  @ValidateIf(o => o.type === 'food')
  public foodGoalQuantity?: number;

  @IsOptional()
  @IsNumber()
  @ValidateIf(o => o.type === 'food')
  public foodCurrentQuantity?: number;

  @IsOptional()
  @IsNumber()
  @ValidateIf(o => o.type === 'money')
  public moneyGoalAmount?: number;

  @IsOptional()
  @IsNumber()
  @ValidateIf(o => o.type === 'money')
  public moneyCurrentAmount?: number;

  @IsOptional()
  @IsNumber()
  @ValidateIf(o => o.type === 'volunteer')
  public volunteerGoalCount?: number;

  @IsOptional()
  @IsNumber()
  @ValidateIf(o => o.type === 'volunteer')
  public volunteerCurrentCount?: number;

  @IsOptional()
  @ValidateIf(o => o.type === 'volunteer')
  @IsString({ each: true })
  @IsArray()
  public volunteers?: string[];

  @IsOptional()
  @ValidateIf(o => o.type === 'food' || o.type === 'money')
  @IsArray()
  public donors?: Donor[];

}
