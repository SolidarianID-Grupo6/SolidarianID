import { IsNotEmpty, IsString } from 'class-validator';

export class CommunityUserAddedDto {
  @IsNotEmpty()
  @IsString()
  public readonly userId: string;

  @IsNotEmpty()
  @IsString()
  public readonly communityId: string;
}
