import { UserJoinStatus } from "./user-request-status.enum";

export class CommunityJoinRequestEntity {
    idCommunity: string;
    idUserId: number;
    status: UserJoinStatus;
}