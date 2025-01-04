import { forwardRef, Module } from '@nestjs/common';
import { GoogleOauthService } from './google.oauth.service';
import { GoogleOauthController } from './google.oauth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../../users.module';
import { IamModule } from '@app/iam';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    forwardRef(() => UsersModule),
    IamModule,
  ],
  controllers: [GoogleOauthController],
  providers: [GoogleOauthService],
})
export class GoogleOauthModule {}
