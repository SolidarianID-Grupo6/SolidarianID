import { IsNotEmpty, IsString } from 'class-validator';

export class CommunityUserAddedDto {
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  readonly communityId: string;
}
