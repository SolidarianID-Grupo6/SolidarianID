import { Either } from 'libs/base/logic/Result';
import { UserNotFoundError } from '../../errors/UserNotFoundError';
import * as Domain from './domain';
import { Repo } from 'libs/base/infra/Repo';

export interface UsersRepo extends Repo<Domain.User> {
  findByFirstName(firstName: string): Promise<Domain.User>;
  findByEmail(firstName: string): Promise<Either<UserNotFoundError, Domain.User>>;
  findAllUsers(): Promise<Domain.User[]>;

}
