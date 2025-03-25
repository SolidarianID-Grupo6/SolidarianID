import { Either } from 'libs/base/logic/Result';
import { UserNotFoundError } from '../../errors/UserNotFoundError';
import * as Domain from './domain';
import { Repo } from 'libs/base/infra/Repo';
import { UserAlreadyExistsError } from '../../errors/UserAlreadyExistsError';
import { UnknownError } from '../../errors/UnknownError';
import { RefreshTokenNotValidError } from '../../errors/RefreshTokenNotValidError';
import { FindQueryDto } from './dto/find-query.dto';

export interface UsersRepo extends Repo<Domain.User> {
  findByFirstName(firstName: string): Promise<Domain.User>;

  findByEmail(
    firstName: string,
  ): Promise<Either<UserNotFoundError, Domain.User>>;

  findAllUsers(): Promise<Domain.User[]>;
  findById(userId: string): Promise<Either<UserNotFoundError, Domain.User>>;
  followUser(userId: string, followedId: string): Promise<Either<UserNotFoundError, void>>;
  updateUser(userId: string, updateUserDto: any): Promise<Either<UserNotFoundError, Domain.User>>;
  saveUser(user: Domain.User): Promise<Either<UserAlreadyExistsError | UnknownError, Domain.User>>;
  removeUser(userId: string): Promise<Either<UserNotFoundError, void>>;

  saveUser(
    user: Domain.User,
  ): Promise<Either<UserAlreadyExistsError | UnknownError, Domain.User>>;

  validateRefreshToken(
    userId: string,
    refreshTokenId: string,
  ): Promise<
    Either<UserNotFoundError | RefreshTokenNotValidError, Domain.User>
  >;

  saveNewToken(userId: string, refreshTokenId: string): Promise<void>;
  findUsers(query: FindQueryDto, activeUserId: string): Promise<Domain.User[]>;
}
