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

export interface UsersService {

  login(userLogin: LoginUserDto): Promise<Either<AuthenticationError, LoginUserDtoResponse>>;

  register(userRegistration: RegisterUserDto);

  refreshTokens(refreshTokenDto: RefreshTokenDto);

  findOne(id: string);

  getProfile(userId: string);

  update(id: string, updateUserDto: UpdateUserDto);
  
  remove(id: string);

  followUser(userId: string, followedId: string);

  find(query: FindQueryDto, activeUserId: string);

  addUserToCommunity(
    userId: string,
    idCommunity: string,
  ): Promise<void>;

  getFullUserInfo(id: string);

  generateTokens(user: Domain.User);

  makeUserAdmin(userId: string);
}
