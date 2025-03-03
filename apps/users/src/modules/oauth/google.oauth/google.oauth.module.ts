import { forwardRef, Module } from '@nestjs/common';
import { GoogleOauthService } from './google.oauth.service';
import { GoogleOauthController } from './google.oauth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { IamModule } from '@app/iam';
import { UsersModule } from '../../users/users.module';
import { User } from '../../users/persistence/user.entity';

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
