import {
  IsEmail,
  IsString,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly surnames: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly isEmailPublic: boolean;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsDateString()
  readonly birthdate: Date;

  @IsNotEmpty()
  @IsBoolean()
  readonly isBirthdatePublic: boolean;

  @IsOptional()
  @IsString()
  readonly presentation?: string;
}
