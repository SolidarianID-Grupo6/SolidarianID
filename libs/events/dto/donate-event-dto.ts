import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DonateEventDto {
    @IsString()
    @IsNotEmpty()
    actionId: string;

    @IsString()
    @IsNotEmpty()
    causeId: string;

    @IsNumber()
    @IsNotEmpty()
    progress: number;
}