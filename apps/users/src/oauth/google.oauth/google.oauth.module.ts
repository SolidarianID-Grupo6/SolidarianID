import { Module } from '@nestjs/common';
import { GoogleOauthService } from './google.oauth.service';
import { GoogleOauthController } from './google.oauth.controller';

@Module({
  controllers: [GoogleOauthController],
  providers: [GoogleOauthService],
})
export class GoogleOauthModule {}
