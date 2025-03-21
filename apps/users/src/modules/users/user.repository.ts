import { Either } from 'libs/base/logic/Result';
import { UserNotFoundError } from '../../errors/UserNotFoundError';
import * as Domain from './domain';
import { Repo } from 'libs/base/infra/Repo';
import { UserAlreadyExistsError } from '../../errors/UserAlreadyExistsError';
import { UnknownError } from '../../errors/UnknownError';

export interface UsersRepo extends Repo<Domain.User> {
  findByFirstName(firstName: string): Promise<Domain.User>;
  findByEmail(firstName: string): Promise<Either<UserNotFoundError, Domain.User>>;
  findAllUsers(): Promise<Domain.User[]>;
  findById(userId: string): Promise<Either<UserNotFoundError, Domain.User>>;
  followUser(userId: string, followedId: string): Promise<Either<UserNotFoundError, void>>;
}
