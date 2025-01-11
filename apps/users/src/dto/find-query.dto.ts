import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class FindQueryDto {
  @IsOptional()
  @IsString()
  userQuery?: string;

  @IsOptional()
  @IsString()
  communityQuery?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  friendshipDepth?: number;

  @IsInt()
  @Min(1)
  limit: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;
}
