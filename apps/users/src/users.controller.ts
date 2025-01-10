import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UsersService } from './users.service';
import { EventPattern } from '@nestjs/microservices';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth } from '@app/iam/authentication/decorators/auth.decorator';
import { AuthType } from '@app/iam/authentication/enums/auth-type.enum';
import { ActiveUser } from '@app/iam/decorators/active-user.decorator';
import { ActiveUserData } from '@app/iam/interfaces/active-user-data.interface';
import { AccessTokenGuard } from '@app/iam/authentication/guards/access-token/access-token.guard';
import { Roles } from '@app/iam/authorization/decorators/roles.decorator';
import { Role } from '@app/iam/authorization/enums/role.enum';

@Controller('users/')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) { }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @EventPattern('test-event')
  async handleEvent(data: string) {
    console.log('Event received');
    console.log(data);
  }

  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @Post()
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() userLogin: LoginUserDto,
  ) {
    const accessToken = await this.usersService.login(userLogin);
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    });
  }

  @Auth(AuthType.None)
  @Post('register')
  register(@Body() userRegistration: RegisterUserDto) {
    return this.usersService.register(userRegistration);
  }

  @HttpCode(HttpStatus.OK)
  @Get('refresh-tokens')
  async refreshTokens(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const newAccessToken = await this.usersService.refreshTokens({
      refreshToken: this.accessTokenGuard.extractTokenFromCookie(
        request,
        'refreshToken',
      ),
    });
    response.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    });
  }

  @Get('user/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Roles(Role.Admin)
  @Get('fullUserInfo/:id')
  getFullUserInfo(@Param('id') id: string, @ActiveUser() user: ActiveUserData) {
    console.log(user);
    return this.usersService.getFullUserInfo(id);
  }
}
