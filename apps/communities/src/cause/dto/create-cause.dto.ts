import { IsArray, IsDateString, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateActionDto } from '../../action/dto/create-action.dto';
import { CreateEventDto } from '../../event/dto/create-event.dto';
import { Type } from 'class-transformer';


export class CreateCauseDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    @IsDateString()
    endDate: string;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateActionDto)
    actions: CreateActionDto[];

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateEventDto)
    events: CreateEventDto[];

    @IsString()
    @IsOptional()
    category: string;

    @IsArray()
    @IsOptional()
    keywords: string[];

    @IsOptional()
    @IsString()
    location: string;

}
