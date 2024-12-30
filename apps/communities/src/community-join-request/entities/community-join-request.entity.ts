import { UserJoinStatus } from "./user-request-status.enum";

export class CommunityJoinRequestEntity {
    id: string;
    idCommunity: string;
    idUser: number;
    status: UserJoinStatus;
}