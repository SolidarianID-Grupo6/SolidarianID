import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async login(userLogin: LoginUserDto) {
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

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );

    return {
      accessToken: accessToken,
    };
  }

  async register(userRegistration: RegisterUserDto) {
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

  findAll() {
    return this.usersRepository.find({
      relations: ['history'],
    });
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException(`User #${id} not found`, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.preload({
      id: id,
      ...updateUserDto,
    });

    if (!user) {
      throw new HttpException(`User #${id} not found`, HttpStatus.NOT_FOUND);
    }

    return this.usersRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.usersRepository.remove(user);
  }
}
