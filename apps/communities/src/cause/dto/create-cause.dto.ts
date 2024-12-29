import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';


export class CreateCauseDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsNumber()
    duration: number;

    @IsOptional()
    @IsArray()
    actions: string[];

    @IsOptional()
    @IsArray()
    events: string[];
}
