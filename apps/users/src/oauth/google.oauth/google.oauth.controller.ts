import { Controller } from '@nestjs/common';
import { GoogleOauthService } from './google.oauth.service';

@Controller('google.oauth')
export class GoogleOauthController {
  constructor(private readonly googleOauthService: GoogleOauthService) {}
}
