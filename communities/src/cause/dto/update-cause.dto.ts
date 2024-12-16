import { IsArray, IsDateString, IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateCauseDto {
    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsDateString()
    creationDate: Date;

    @IsOptional()
    @IsString()
    community: string;

    @IsOptional()
    @IsString()
    status: string;

    @IsOptional()
    @IsArray()
    actions: string[];

    @IsOptional()
    @IsArray()
    events: string[];
}
