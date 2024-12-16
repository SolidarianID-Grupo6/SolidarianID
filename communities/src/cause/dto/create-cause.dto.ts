import { IsArray, IsDateString, IsNumber, IsString } from 'class-validator';
export class CreateCauseDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsDateString()
    creationDate: Date;

    @IsString()
    community: string;

    @IsString()
    status: string;

    @IsArray()
    actions: string[];

    @IsArray()
    events: string[];
}
