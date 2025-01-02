import {
  IsEmail,
  IsString,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsNotEmpty,
  MinLength,
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
  @MinLength(8)
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
