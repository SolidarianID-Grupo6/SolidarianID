import { IsString } from 'class-validator';
export class SupportEventDto {
    @IsString()
    public causeId: string;

    @IsString()
    public communityId: string;
}
