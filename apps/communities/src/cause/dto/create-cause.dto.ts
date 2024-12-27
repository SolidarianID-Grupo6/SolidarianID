import { IsArray, IsDateString, IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';
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
