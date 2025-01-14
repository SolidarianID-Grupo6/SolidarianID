import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Auth } from '@app/iam/authentication/decorators/auth.decorator';
import { AuthType } from '@app/iam/authentication/enums/auth-type.enum';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../users.service';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('OAuth')
@Auth(AuthType.None)
@Controller('oauth/google')
export class GoogleOauthController {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Authenticate with Google OAuth 2.0' })
  @Get()
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    return { msg: 'Google Authentication' };
  }

  @ApiOperation({ summary: 'GitHub OAuth 2.0 callback' })
  @Get('callback')
  @UseGuards(AuthGuard('google'))
  async handleRedirect(@Req() req, @Res({ passthrough: true }) res: Response) {
    const userProfile = req.user;
    try {
      let user = await this.usersRepository.findOne({
        where: { googleId: req.user.id },
      });

      if (!user) {
        const newUser = this.usersRepository.create({
          googleId: userProfile.id,
          email: userProfile.emails[0].value,
          name: userProfile.name.givenName,
          surnames: userProfile.name.familyName,
          birthdate: userProfile.birthday
            ? new Date(userProfile.birthday)
            : new Date(),
        });
        user = await this.usersRepository.save(newUser);
      }
      const accessToken = await this.usersService.generateTokens(user);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: true,
      });
      const { password, googleId, githubId, role, ...userResponse } = user;
      return res.json({
        user: userResponse,
      });
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException();
    }
  }
}
