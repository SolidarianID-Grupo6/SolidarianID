import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './persistence/user.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { FindQueryDto } from './dto/find-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface UsersService {

  login(userLogin: LoginUserDto);

  register(userRegistration: RegisterUserDto);

  refreshTokens(refreshTokenDto: RefreshTokenDto);

  findOne(id: string);

  getProfile(userId: string);

  update(id: string, updateUserDto: UpdateUserDto)
  
  remove(id: string);

  followUser(userId: string, followedId: string)

  find(query: FindQueryDto, activeUserId: string)

  addUserToCommunity(
    userId: string,
    idCommunity: string,
  ): Promise<void> 

  getFullUserInfo(id: string) 

  generateTokens(user: User) 

  makeUserAdmin(userId: string)
}
