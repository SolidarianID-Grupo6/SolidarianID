import { IsEmail, IsString } from "class-validator";

export class SupportUserAnonymousDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    name: string;
}
