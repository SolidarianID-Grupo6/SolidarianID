import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCommunityRequestsDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  creator: number;

  @IsOptional()
  @IsString()
  status: string = 'Pending';  // Establecer un valor predeterminado
}
