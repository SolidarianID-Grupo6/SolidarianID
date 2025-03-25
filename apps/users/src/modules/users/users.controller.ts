import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth } from '@app/iam/authentication/decorators/auth.decorator';
import { AuthType } from '@app/iam/authentication/enums/auth-type.enum';
import { ActiveUser } from '@app/iam/decorators/active-user.decorator';
import { IActiveUserData } from '@app/iam/interfaces/active-user-data.interface';
import { AccessTokenGuard } from '@app/iam/authentication/guards/access-token/access-token.guard';
import { Roles } from '@app/iam/authorization/decorators/roles.decorator';
import { Role } from '@app/iam/authorization/enums/role.enum';
import { FindQueryDto } from './dto/find-query.dto';
import {
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EventPattern } from '@nestjs/microservices';
import { CommunityUserAddedDto } from 'libs/events/dto/community-user-added.dto';
import { CommunityEvent } from 'libs/events/enums/community.events.enum';
import { AuthenticationError } from '../../errors/AuthenticationError';
import { NotFoundError } from 'rxjs';
import { UserNotFoundError } from '../../errors/UserNotFoundError';
import { UserAlreadyExistsError } from '../../errors/UserAlreadyExistsError';
import { RegisterUserDtoResponse } from './dto/register-user.dto.response';
import { RefreshTokenNotValidError } from '../../errors/RefreshTokenNotValidError';

@ApiTags('Users')
@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) { }

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Correct authentication' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'When a field is missing or the email is badly formated',
  })
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() userLogin: LoginUserDto,
  ) {
    const tokensResultOrError = await this.usersService.login(userLogin);

    if (tokensResultOrError.isLeft()) {
      throw new HttpException('Email or password are incorrect', HttpStatus.UNAUTHORIZED);
    }

    response.cookie('accessToken', tokensResultOrError.value, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    });
  }

  @ApiOperation({ summary: 'New user registration' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Correct registration',
    example: {
      name: 'John',
      surnames: 'Doe',
      email: 'john.doe@example.com',
      isEmailPublic: false,
      birthdate: '1990-01-01',
      isBirthdatePublic: false,
      presentation: "Hello, I'm John Doe!",
      id: '820602d5-24d6-41a6-9861-1dc008f63d50',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'When a field is missing, the email is badly formated or the password is shorter than 8 characters, does not have lower case or/and upper case characters',
  })
  @Auth(AuthType.None)
  @Post()
  register(@Body() userRegistration: RegisterUserDto): RegisterUserDtoResponse {
    const userOrError = this.usersService.register(userRegistration);

    if (userOrError.isLeft()) {
      switch (userOrError.value.constructor) {
        case UserAlreadyExistsError:
          throw new HttpException(userOrError.value.message, HttpStatus.CONFLICT);
        default:
          throw new InternalServerErrorException();
      }
    }

    return userOrError.value;
  }

  @ApiOperation({ summary: 'Refresh the authorization token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refresh token is not expired',
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @HttpCode(HttpStatus.OK)
  @Get('refresh-tokens')
  async refreshTokens(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // TODO: CHANGE FROM EXPRESS TO ABSTRACT NEXTJS REQUEST
    const newAccessToken = await this.usersService.refreshTokens({
      refreshToken: this.accessTokenGuard.extractTokenFromCookie(
        request,
        'refreshToken',
      ),
    });

    if (newAccessToken.isLeft()) {
      switch (newAccessToken.value.constructor) {
        case UserNotFoundError:
          throw new HttpException(newAccessToken.value.message, HttpStatus.NOT_FOUND);
        case RefreshTokenNotValidError:
          throw new HttpException(newAccessToken.value.message, HttpStatus.FORBIDDEN);
        default:
          throw new InternalServerErrorException();
      }
    }

    response.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    });
  }

  @ApiOperation({ summary: 'Get your current user profile' })
  @Get('profile')
  async getProfile(@ActiveUser() user: IActiveUserData) {
    const userResultOrError = await this.usersService.getProfile(user.sub);

    if (userResultOrError.isLeft()) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return userResultOrError.value;
  }

  @ApiOperation({ summary: 'Get the profile of a given user by their id' })
  @Auth(AuthType.None)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const userResult = await this.usersService.findOne(id);

    if (userResult.isLeft()) {
      const error = userResult.value;

      if (error instanceof UserNotFoundError) {
        throw new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
      }

      throw new InternalServerErrorException('An error occurred while retrieving the user');
    }

    return userResult.value;
  }

  @ApiOperation({
    summary: 'Update your user profile or hide/unhide public data',
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const userResult = await this.usersService.update(id, updateUserDto);

    const error = userResult.value;

    if (error instanceof UserNotFoundError) {
      throw new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }

    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'User Following' })
  @Post('following')
  async followUser(
    @ActiveUser() user: IActiveUserData,
    @Res({ passthrough: true }) response: Response,
    @Body('targetUser') followedId: string,
  ) {
    const tokensResultOrError = await this.usersService.followUser(user.sub, followedId);

    if (tokensResultOrError.isLeft()) {
      throw new HttpException('Email or password are incorrect', HttpStatus.UNAUTHORIZED);
    }

    response.cookie('accessToken', tokensResultOrError.value, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    });
  }

  @ApiOperation({ summary: 'User searching' })
  @Get()
  async find(@Body() query: FindQueryDto, @ActiveUser() user: IActiveUserData) {
    return this.usersService.find(query, user.sub);
  }

  @ApiOperation({ summary: 'Account deletion' })
  @Roles(Role.Admin)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    const result = await this.usersService.remove(id);

    if (result.isLeft()) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return;
  }

  // TODO: review if the events should be move to different class
  @EventPattern(CommunityEvent.NewCommunityUser)
  async handleEvent(dto: CommunityUserAddedDto) {
    this.usersService.addUserToCommunity(dto.userId, dto.communityId);
  }
}
