import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HashingService } from '@app/iam/hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '@app/iam/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { randomUUID } from 'crypto';
import { InvalidatedRefreshTokenError }
  from '@app/iam/authentication/refresh-token-ids.storage/InvalidatedRefreshTokenError';
import { RefreshTokenIdsStorage }
  from '@app/iam/authentication/refresh-token-ids.storage/refresh-token-ids.storage';
import { IActiveUserData } from '@app/iam/interfaces/active-user-data.interface';

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) { }

  public async login(userLogin: LoginUserDto) {
    const user = await this.usersRepository.findOne({
      where: { email: userLogin.email },
    });

    if (!user) {
      throw new HttpException(
        `User with email ${userLogin.email} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordValid = await this.hashingService.compare(
      userLogin.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    const tokens = await this.generateTokens(user);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  public async register(userRegistration: RegisterUserDto) {
    // Check if user already exists (email is already registered):
    const user = await this.usersRepository.findOne({
      where: { email: userRegistration.email },
    });

    if (user) {
      throw new HttpException(
        `User with email ${userRegistration.email} already exists`,
        HttpStatus.CONFLICT,
      );
    }

    const userDto = {
      ...userRegistration,
      password: await this.hashingService.hash(userRegistration.password),
    };
    const newUser = this.usersRepository.create(userDto);
    const { password, ...response } = await this.usersRepository.save(newUser);
    return response;
  }

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<IActiveUserData, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      const user = await this.usersRepository.findOneOrFail({
        where: { id: sub },
      });
      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );
      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(user.id);
      } else {
        throw new Error('Refresh token is invalid');
      }
      const tokens = await this.generateTokens(user);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (err) {
      if (err instanceof InvalidatedRefreshTokenError)
        throw new UnauthorizedException('Refresh token has expired');
      throw new UnauthorizedException();
    }
  }

  public findAll() {
    return this.usersRepository.find();
  }

  public async findOne(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException(`User #${id} not found`, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.preload({
      id: id,
      ...updateUserDto,
    });

    if (!user) {
      throw new HttpException(`User #${id} not found`, HttpStatus.NOT_FOUND);
    }

    return this.usersRepository.save(user);
  }

  public async remove(id: string) {
    const user = await this.findOne(id);
    return this.usersRepository.remove(user);
  }

  public async getFullUserInfo(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['history'], // Requests cascading the whole relation objects of the user.
    });

    if (!user) {
      throw new HttpException(`User #${id} not found`, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  public async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<IActiveUserData>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);
    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);
    return {
      accessToken,
      refreshToken,
    };
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: expiresIn,
      },
    );
  }
}
