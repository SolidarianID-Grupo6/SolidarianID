import { Repo } from 'libs/base/infra/Repo';
import * as Domain from './domain';
import { Either } from 'libs/base/logic/Result';
import { UserNotFoundError } from '../../errors/UserNotFoundError';
import { CommunityEvent } from 'libs/events/enums/community.events.enum';

export interface HistoryRepo extends Repo<Domain.History> {
  exists(t: Domain.History): Promise<boolean>;
  save(t: Domain.History): Promise<Domain.History>;
  findAll(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<Either<UserNotFoundError, Domain.History[]>>;
  userExists(userId: string): Promise<boolean>;
  registerHistoryRecord(
    event: CommunityEvent,
    userId: string,
    dto: any,
  ): Promise<Either<UserNotFoundError, Domain.History>>;
}
