import { CreateCauseDto } from "../../cause/dto/create-cause.dto";
import { CommunityRequestStatus } from "./CommunityRequest-status.enum";

export class CommunityRequestsEntity {
  id: string;
  name: string;
  description: string;
  creator: string;
  status: CommunityRequestStatus;
  rejectReason: string;
  requestDate: Date;
  causes: CreateCauseDto[];
}
