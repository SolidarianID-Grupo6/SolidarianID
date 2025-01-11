import { IsString } from 'class-validator';

export class VolunteerActionDto {
  @IsString()
  user: string; 
}
