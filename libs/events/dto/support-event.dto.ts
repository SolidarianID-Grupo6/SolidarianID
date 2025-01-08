import { IsString } from 'class-validator';
export class SupportEventDto {
    @IsString()
    causeId: string;

    @IsString()
    communityId: string;
}
