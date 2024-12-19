import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  login(userRegistration: LoginUserDto) {
    return userRegistration;
  }

  register(userRegistration: RegisterUserDto) {
    return userRegistration;
  }

  findAll(): string {
    return 'Here go all users!';
  }

  findOne(id: number) {
    const user = null;

    if (!user) {
      throw new HttpException(`User #${id} not found`, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `Update user with id ${id}`;
  }

  remove(id: number) {
    return `Remove user with id ${id}`;
  }
}
