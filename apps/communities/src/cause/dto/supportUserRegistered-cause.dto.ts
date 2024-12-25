import { IsNumber } from "class-validator";

export class SupportUserRegisteredDto {
    @IsNumber()
    userId: number;
}