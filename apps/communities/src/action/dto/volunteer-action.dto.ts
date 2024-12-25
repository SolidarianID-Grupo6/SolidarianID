import { PartialType } from '@nestjs/mapped-types';
import { DonateActionDto } from './donate-action.dto';

export class VolunteerActionDto extends PartialType(DonateActionDto) {}
