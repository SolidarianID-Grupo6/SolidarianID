import { DonateActionEventDto } from './donate-action-event.dto copy';
import { PartialType } from '@nestjs/mapped-types';

export class VolunteerActionEventDto extends PartialType(DonateActionEventDto) {}