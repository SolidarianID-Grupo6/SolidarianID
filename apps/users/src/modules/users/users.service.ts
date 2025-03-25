import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './persistence/user.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { FindQueryDto } from './dto/find-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Either } from 'libs/base/logic/Result';
import { UserNotFoundError } from '../../errors/UserNotFoundError';
import { AuthenticationError } from '../../errors/AuthenticationError';
import { LoginUserDtoResponse } from './dto/login-user.dto.response';
import * as Domain from './domain';
import { UserAlreadyExistsError } from '../../errors/UserAlreadyExistsError';
import { RegisterUserDtoResponse } from './dto/register-user.dto.response';

export interface UsersService {
  login(
    userLogin: LoginUserDto,
  ): Promise<Either<AuthenticationError, LoginUserDtoResponse>>;

  register(
    userRegistration: RegisterUserDto,
  ): Promise<Either<UserAlreadyExistsError, RegisterUserDtoResponse>>;

  refreshTokens(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<
    Either<AuthenticationError, { accessToken: string; refreshToken: string }>
  >;

  findOne(id: string): Promise<Either<UserNotFoundError, Domain.User>>;

  getProfile(userId: string): Promise<Either<UserNotFoundError, Domain.User>>;

  update(id: string, updateUserDto: UpdateUserDto);

  remove(id: string);

  update(id: string, updateUserDto: UpdateUserDto): Promise<any>;

  remove(id: string): Promise<Either<UserNotFoundError, void>>;

  followUser(userId: string, followedId: string): Promise<any>;

  find(query: FindQueryDto, activeUserId: string): Promise<any>;

  addUserToCommunity(userId: string, idCommunity: string): Promise<void>;

  getFullUserInfo(id: string): Promise<any>;

  generateTokens(user: Domain.User): Promise<LoginUserDtoResponse>;

  makeUserAdmin(userId: string): Promise<any>;
}
