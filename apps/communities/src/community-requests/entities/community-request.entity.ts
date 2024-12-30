import { CreateCauseDto } from "../../cause/dto/create-cause.dto";
import { CommunityRequestStatus } from "./CommunityRequest-status.enum";

export class CommunityRequestsEntity {
    name: string;
    description: string;
    creator: number;
    status: CommunityRequestStatus;
    requestDate: Date;
    causes: CreateCauseDto[];
  }