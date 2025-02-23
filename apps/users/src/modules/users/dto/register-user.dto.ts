import {
  IsEmail,
  IsString,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsNotEmpty,
  MinLength,
  Matches,
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
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
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
