import { Cause } from "../../cause/schemas/cause.schema";
import { CommunityRequestStatus } from "./CommunityRequest-status.enum";

export class CommunityRequestsEntity {
    name: string;
    description: string;
    creator: number;
    status: CommunityRequestStatus;
    requestDate: Date;
    causes: Cause[];
  }