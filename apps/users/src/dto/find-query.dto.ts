import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class FindQueryDto {
  @ApiProperty({
    description: 'Partial or total name, surname or/and ID of the user to find',
    example: 'john doe',
  })
  @IsOptional()
  @IsString()
  userQuery?: string;

  @ApiProperty({
    description: 'Partial or total name or/and ID of the community to find',
    example: 'safe the children',
  })
  @IsOptional()
  @IsString()
  communityQuery?: string;

  @ApiProperty({
    description:
      'The connection distance between you and the user(s) to find. 0 means you do not have any connection. 1 means they are your friends. number > 1 means they are friends of your friends, and so on.',
    example: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  friendshipDepth?: number;

  @ApiProperty({
    description:
      'The maximum number of results to return. Must be greater than 0.',
    example: 10,
  })
  @IsInt()
  @Min(1)
  limit: number;

  @ApiProperty({
    description:
      'The number of results to skip. Must be greater than or equal to 0.',
    example: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;
}
