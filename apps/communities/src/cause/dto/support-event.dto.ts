import { IsNumber, IsString } from 'class-validator';
export class SupportEventDto {
    @IsNumber()
    userId: number;

    @IsString()
    causeId: string;
}
