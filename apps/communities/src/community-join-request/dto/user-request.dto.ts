import { IsNumber } from 'class-validator';

export class UserRequestDto {
  @IsNumber()
  userId: number;
}
