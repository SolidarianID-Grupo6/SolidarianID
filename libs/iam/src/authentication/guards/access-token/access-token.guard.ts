import jwtConfig from '@app/iam/config/jwt.config';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'libs/iam/iam.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  public constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) { }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token =
      this.extractTokenFromCookie(request, 'accessToken') ??
      this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      request[REQUEST_USER_KEY] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  public extractTokenFromCookie(
    request: Request,
    tokenName: string,
  ): string | undefined {
    try {
      const cookieHeader = decodeURIComponent(request.headers.cookie);
      if (!cookieHeader) return undefined;

      const accessTokenCookie = cookieHeader
        .split(';')
        .find((c) => c.trim().startsWith(`accessToken=`));

      if (!accessTokenCookie) return undefined;

      const JWTString = accessTokenCookie.split('=j:')[1];
      const JWT = JSON.parse(JWTString);

      return JWT[tokenName];
    } catch (error) {
      return undefined;
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
