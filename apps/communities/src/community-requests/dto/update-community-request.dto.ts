import { PartialType } from '@nestjs/mapped-types';
import { CreateCommunityRequestsDto } from './create-community-request.dto';

export class UpdateCommunityRequestDto extends PartialType(CreateCommunityRequestsDto) {}
