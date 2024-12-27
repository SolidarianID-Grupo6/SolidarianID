import { IsNumber, IsString } from 'class-validator';

export class UserJoinEventDto {
  @IsNumber()
  userId: number;

  @IsString()
  communityId: string; 
}
